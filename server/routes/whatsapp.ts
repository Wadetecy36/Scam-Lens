import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import { sendError, sendJson, sendText, sendXml } from "../http.js";
import { executeAnalysisPipeline } from "../services/analysis-pipeline.js";
import {
  verifyTwilioWebhookSignature,
  verifyMetaWebhookSignature,
  checkAndRecordTwilioSid,
  checkMetaTimestampValidity,
} from "../security/webhook-auth.js";
import {
  sanitizeAnalysisForStorage,
  savePublicResult,
} from "../services/result-store.js";
import { env } from "../env.js";

const MAX_BODY_BYTES = 35_000;

async function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;

    req.setEncoding("utf8");

    req.on("data", (chunk: string) => {
      size += Buffer.byteLength(chunk, "utf8");
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export function formatWhatsAppReply(
  analysis: Awaited<ReturnType<typeof executeAnalysisPipeline>>["analysis"],
  resultId?: string,
): string {
  const emoji =
    analysis.riskLevel === "HIGH"
      ? "🛑"
      : analysis.riskLevel === "SUSPICIOUS"
      ? "⚠️"
      : analysis.riskLevel === "CAUTION"
      ? "⚡"
      : "✅";

  const topAction =
    analysis.recommendedActions[0] ||
    "Do not click links or send money until you verify directly.";

  let reply = `${emoji} *ScamLens Alert: ${analysis.riskLevel} (${Math.round(analysis.riskScore)}/100)*\n\n`;

  reply += `💡 *What to do:*\n${topAction}\n\n`;

  reply += `🔍 *Why:*\n${analysis.explanations.simple || analysis.summary}\n`;

  if (analysis.warningSigns.length > 0) {
    reply += `\n⚠️ *Warning Signs:*\n`;
    for (const sign of analysis.warningSigns.slice(0, 3)) {
      reply += `• *${sign.type.replaceAll("_", " ")}*: ${sign.explanation}\n`;
    }
  }

  const idToUse = resultId || analysis.id;
  reply += `\n👉 *Full Report & USSD Checks:*\nhttps://scam-lens-blue.vercel.app/result/${idToUse}`;

  return reply;
}

function reconstructFullUrl(req: IncomingMessage): string {
  if (process.env.TWILIO_WEBHOOK_URL) {
    return process.env.TWILIO_WEBHOOK_URL;
  }
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host =
    (req.headers["x-forwarded-host"] as string) ||
    req.headers.host ||
    "localhost";
  return `${proto}://${host}${req.url ?? ""}`;
}

/**
 * Handles incoming WhatsApp webhook requests from Twilio or Meta WhatsApp Cloud API.
 * Strictly verifies provider signatures before executing any downstream analysis.
 */
export async function handleWhatsAppWebhook(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const urlObj = new URL(req.url ?? "/", "http://localhost");

  // 1. Meta Webhook Verification (GET /api/whatsapp)
  if (req.method === "GET") {
    const mode = urlObj.searchParams.get("hub.mode");
    const token = urlObj.searchParams.get("hub.verify_token");
    const challenge = urlObj.searchParams.get("hub.challenge");

    const expectedToken =
      process.env.WHATSAPP_VERIFY_TOKEN || env.whatsappVerifyToken || "scamlens_verify_token";

    if (mode === "subscribe" && token && expectedToken) {
      const tokenBuf = Buffer.from(token, "utf8");
      const expectedBuf = Buffer.from(expectedToken, "utf8");

      if (
        tokenBuf.length === expectedBuf.length &&
        crypto.timingSafeEqual(tokenBuf, expectedBuf)
      ) {
        console.log("[whatsapp] Meta webhook verified successfully.");
        sendText(res, 200, challenge ?? "");
        return;
      }
    }

    sendError(res, 403, "FORBIDDEN", "Webhook verification token mismatch.");
    return;
  }

  // 2. Incoming Messages (POST)
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET and POST are supported.");
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    const contentType = req.headers["content-type"] || "";

    // ----------------------------------------------------
    // Scenario A: Twilio WhatsApp Webhook (urlencoded)
    // ----------------------------------------------------
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const twilioSignature = req.headers["x-twilio-signature"] as string | undefined;
      const twilioAuthToken =
        process.env.TWILIO_AUTH_TOKEN || env.twilioAuthToken || (env.nodeEnv === "test" ? "test_twilio_token" : "");

      // FAIL-CLOSED: Authentication MUST occur BEFORE any AI, threat-intel, or parsing
      if (!twilioSignature) {
        sendError(res, 401, "UNAUTHORIZED", "Missing Twilio webhook signature.");
        return;
      }

      if (!twilioAuthToken) {
        console.error("[whatsapp:twilio] TWILIO_AUTH_TOKEN is not configured on server.");
        sendError(res, 500, "CONFIGURATION_ERROR", "Webhook authentication is not configured.");
        return;
      }

      const params = new URLSearchParams(rawBody);
      const paramsObj: Record<string, string> = {};
      for (const [key, val] of params.entries()) {
        paramsObj[key] = val;
      }

      const fullUrl = reconstructFullUrl(req);
      const isSignatureValid = verifyTwilioWebhookSignature({
        signature: twilioSignature,
        url: fullUrl,
        params: paramsObj,
        authToken: twilioAuthToken,
      });

      if (!isSignatureValid) {
        console.warn("[whatsapp:twilio] Rejected request with invalid Twilio signature.");
        sendError(res, 403, "FORBIDDEN", "Invalid webhook signature.");
        return;
      }

      // Replay check on MessageSid
      const messageSid = params.get("MessageSid") || undefined;
      if (!checkAndRecordTwilioSid(messageSid)) {
        console.warn(`[whatsapp:twilio] Rejected replayed MessageSid: ${messageSid}`);
        sendError(res, 403, "FORBIDDEN", "Duplicate message replay detected.");
        return;
      }

      const incomingText = params.get("Body")?.trim() || "";
      const sender = params.get("From") || "Unknown";

      console.log(`[whatsapp:twilio] Validated message from ${sender}: ${incomingText.slice(0, 60)}...`);

      if (!incomingText) {
        const greeting = `👋 *Welcome to ScamLens Ghana!*

Forward any suspicious text, Mobile Money (MoMo) transfer alert, or link to this chat.

We will scan it instantly and advise you before you send money or dial any PIN.`;

        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(greeting)}</Message>
</Response>`;
        sendXml(res, 200, twiml);
        return;
      }

      // Execute ScamLens detection pipeline
      const { analysis, threatIntel } = await executeAnalysisPipeline(incomingText, "message");

      // Persist the sanitized public result so the link works for the recipient
      const sanitized = sanitizeAnalysisForStorage(analysis, threatIntel, "whatsapp");
      await savePublicResult(sanitized);

      const replyMessage = formatWhatsAppReply(analysis, sanitized.id);

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(replyMessage)}</Message>
</Response>`;

      sendXml(res, 200, twiml);
      return;
    }

    // ----------------------------------------------------
    // Scenario B: Meta Cloud API / JSON Webhook
    // ----------------------------------------------------
    const metaSignature = req.headers["x-hub-signature-256"] as string | undefined;
    const metaAppSecret =
      process.env.WHATSAPP_APP_SECRET ||
      process.env.META_APP_SECRET ||
      env.whatsappAppSecret ||
      (env.nodeEnv === "test" ? "test_app_secret" : "");

    // FAIL-CLOSED: Authentication MUST occur BEFORE any expensive AI or parsing
    if (!metaSignature) {
      sendError(res, 401, "UNAUTHORIZED", "Missing Meta webhook signature.");
      return;
    }

    if (!metaAppSecret) {
      console.error("[whatsapp:meta] WHATSAPP_APP_SECRET is not configured on server.");
      sendError(res, 500, "CONFIGURATION_ERROR", "Webhook authentication is not configured.");
      return;
    }

    const isMetaSigValid = verifyMetaWebhookSignature({
      signatureHeader: metaSignature,
      rawBody,
      appSecret: metaAppSecret,
    });

    if (!isMetaSigValid) {
      console.warn("[whatsapp:meta] Rejected request with invalid Meta signature.");
      sendError(res, 403, "FORBIDDEN", "Invalid webhook signature.");
      return;
    }

    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(rawBody);
    } catch {
      sendError(res, 400, "INVALID_JSON", "Expected valid JSON body.");
      return;
    }

    const metaMessage = (json as any)?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Replay/timestamp check
    if (!checkMetaTimestampValidity(metaMessage?.timestamp)) {
      console.warn("[whatsapp:meta] Message timestamp is stale or invalid.");
      sendError(res, 403, "FORBIDDEN", "Message timestamp expired or invalid.");
      return;
    }

    const directText = typeof json.text === "string" ? json.text : undefined;
    const incomingText = (metaMessage?.text?.body || directText || "").trim();
    const recipientFrom = metaMessage?.from || (json as any)?.from;

    if (!incomingText) {
      sendJson(res, 200, {
        ok: true,
        message: "Webhook received. No text payload to analyze.",
      });
      return;
    }

    const { analysis, threatIntel } = await executeAnalysisPipeline(incomingText, "message");

    // Persist sanitized result
    const sanitized = sanitizeAnalysisForStorage(analysis, threatIntel, "whatsapp");
    await savePublicResult(sanitized);

    const formattedReply = formatWhatsAppReply(analysis, sanitized.id);

    // If Meta Cloud API credentials are provided, send an outbound response
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (token && phoneId && recipientFrom) {
      try {
        await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: recipientFrom,
            type: "text",
            text: { body: formattedReply },
          }),
        });
      } catch (graphErr) {
        console.error("[whatsapp:meta] Failed to send outbound WhatsApp reply:", graphErr);
      }
    }

    sendJson(res, 200, {
      ok: true,
      analysis,
      threatIntel: threatIntel.length > 0 ? threatIntel : undefined,
      replyPreview: formattedReply,
    });
  } catch (err) {
    console.error("[whatsapp] Webhook processing error:", err);
    sendError(
      res,
      500,
      "WHATSAPP_WEBHOOK_ERROR",
      err instanceof Error ? err.message : "Failed to process WhatsApp webhook.",
    );
  }
}
