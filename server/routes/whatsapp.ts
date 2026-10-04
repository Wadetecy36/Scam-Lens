import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson, sendText, sendXml } from "../http.js";
import { executeAnalysisPipeline } from "../services/analysis-pipeline.js";
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

  reply += `\n👉 *Full Report & USSD Checks:*\nhttps://scam-lens-blue.vercel.app/result/${analysis.id}`;

  return reply;
}

/**
 * Handles incoming WhatsApp webhook requests from Twilio or Meta WhatsApp Cloud API.
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

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "scamlens_verify_token";

    if (mode === "subscribe" && token === expectedToken) {
      console.log("[whatsapp] Meta webhook verified successfully.");
      sendText(res, 200, challenge ?? "");
      return;
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
      const params = new URLSearchParams(rawBody);
      const incomingText = params.get("Body")?.trim() || "";
      const sender = params.get("From") || "Unknown";

      console.log(`[whatsapp:twilio] Received message from ${sender}: ${incomingText.slice(0, 60)}...`);

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
      const { analysis } = await executeAnalysisPipeline(incomingText, "message");
      const replyMessage = formatWhatsAppReply(analysis);

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
    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(rawBody);
    } catch {
      sendError(res, 400, "INVALID_JSON", "Expected valid JSON or urlencoded body.");
      return;
    }

    // Direct JSON test or standard payload
    const directText = typeof json.text === "string" ? json.text : undefined;
    const metaMessage = (json as any)?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
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
    const formattedReply = formatWhatsAppReply(analysis);

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
