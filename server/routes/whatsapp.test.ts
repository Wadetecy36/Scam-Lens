import { describe, expect, it, vi, beforeEach } from "vitest";
import { EventEmitter } from "node:events";
import crypto from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleWhatsAppWebhook, formatWhatsAppReply } from "./whatsapp.js";
import * as pipelineModule from "../services/analysis-pipeline.js";

const TEST_TWILIO_TOKEN = "test_twilio_secret_token_12345";
const TEST_META_SECRET = "test_meta_app_secret_67890";
const TEST_BASE_URL = "https://scamlens.test/api/whatsapp";

function createMockReq(options: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}): IncomingMessage {
  const emitter = new EventEmitter() as any;
  emitter.method = options.method;
  emitter.url = options.url;
  emitter.headers = {
    host: "scamlens.test",
    "x-forwarded-proto": "https",
    ...(options.headers || {}),
  };
  emitter.setEncoding = () => {};

  process.nextTick(() => {
    if (options.body) {
      emitter.emit("data", options.body);
    }
    emitter.emit("end");
  });

  return emitter as IncomingMessage;
}

function createMockRes(): {
  res: ServerResponse;
  getData: () => { statusCode: number; headers: Record<string, string>; body: string };
} {
  let statusCode = 200;
  const headers: Record<string, string> = {};
  let body = "";

  const res: any = {
    statusCode: 200,
    setHeader: (key: string, value: string) => {
      headers[key.toLowerCase()] = value;
    },
    end: (chunk?: string) => {
      if (chunk) body += chunk;
      statusCode = res.statusCode;
    },
  };

  return {
    res: res as ServerResponse,
    getData: () => ({ statusCode, headers, body }),
  };
}

function signTwilioPayload(url: string, params: Record<string, string>, token = TEST_TWILIO_TOKEN): string {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const k of sortedKeys) {
    data += k + params[k];
  }
  return crypto.createHmac("sha1", token).update(Buffer.from(data, "utf8")).digest("base64");
}

function signMetaPayload(rawBody: string, secret = TEST_META_SECRET): string {
  const digest = crypto.createHmac("sha256", secret).update(Buffer.from(rawBody, "utf8")).digest("hex");
  return `sha256=${digest}`;
}

describe("WhatsApp Webhook Security & Processing", () => {
  beforeEach(() => {
    process.env.TWILIO_AUTH_TOKEN = TEST_TWILIO_TOKEN;
    process.env.WHATSAPP_APP_SECRET = TEST_META_SECRET;
    process.env.WHATSAPP_VERIFY_TOKEN = "scamlens_verify_token";
    delete process.env.TWILIO_WEBHOOK_URL;
  });

  // 1. Meta Webhook Verification
  it("verifies Meta webhook challenge on GET with valid token", async () => {
    const req = createMockReq({
      method: "GET",
      url: "/api/whatsapp?hub.mode=subscribe&hub.verify_token=scamlens_verify_token&hub.challenge=test_challenge_12345",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    expect(data.body).toBe("test_challenge_12345");
  });

  it("rejects Meta webhook verification on token mismatch (403)", async () => {
    const req = createMockReq({
      method: "GET",
      url: "/api/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=fail",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  // 2. Twilio Signature Verification (Fail-Closed)
  it("accepts Twilio request with valid X-Twilio-Signature", async () => {
    const params: Record<string, string> = {
      From: "whatsapp:+233241234567",
      Body: "Payment received for GHS 500 from KWAME. Please reverse the mistaken transfer immediately.",
      MessageSid: `SM_valid_${Date.now()}`,
    };
    const bodyStr = new URLSearchParams(params).toString();
    const signature = signTwilioPayload(TEST_BASE_URL, params);

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": signature,
      },
      body: bodyStr,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    expect(data.headers["content-type"]).toContain("application/xml");
    expect(data.body).toContain("<Response>");
    expect(data.body).toContain("ScamLens Alert: HIGH");
    expect(data.body).toContain("https://scam-lens-blue.vercel.app/result/an_");
  });

  it("rejects Twilio request when X-Twilio-Signature is missing (401)", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "From=whatsapp%3A%2B233241234567&Body=Test",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(401);
    expect(data.body).toContain("Missing Twilio webhook signature");
  });

  it("rejects Twilio request when X-Twilio-Signature is invalid (403)", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": "bogus_signature_abc123",
      },
      body: "From=whatsapp%3A%2B233241234567&Body=Test",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
    expect(data.body).toContain("Invalid webhook signature");
  });

  it("rejects Twilio request when body parameters are tampered with (403)", async () => {
    const originalParams: Record<string, string> = {
      From: "whatsapp:+233241234567",
      Body: "Original safe text",
      MessageSid: `SM_tamper_${Date.now()}`,
    };
    const signature = signTwilioPayload(TEST_BASE_URL, originalParams);

    // Tampered body: attacker changed the Body
    const tamperedParams = { ...originalParams, Body: "Malicious injection text" };
    const tamperedBody = new URLSearchParams(tamperedParams).toString();

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": signature,
      },
      body: tamperedBody,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  it("rejects Twilio request when URL path or host is modified (403)", async () => {
    const params: Record<string, string> = {
      From: "whatsapp:+233241234567",
      Body: "Testing URL mismatch",
    };
    // Signed against evil.com instead of scamlens.test
    const signature = signTwilioPayload("https://evil.com/api/whatsapp", params);

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": signature,
      },
      body: new URLSearchParams(params).toString(),
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  it("rejects duplicate Twilio MessageSid replay attack (403)", async () => {
    const sid = `SM_replay_attack_${Date.now()}`;
    const params: Record<string, string> = {
      From: "whatsapp:+233241234567",
      Body: "Welcome check",
      MessageSid: sid,
    };
    const bodyStr = new URLSearchParams(params).toString();
    const signature = signTwilioPayload(TEST_BASE_URL, params);

    const sendReq = () =>
      createMockReq({
        method: "POST",
        url: "/api/whatsapp",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-twilio-signature": signature,
        },
        body: bodyStr,
      });

    // 1st request -> accepted
    const first = createMockRes();
    await handleWhatsAppWebhook(sendReq(), first.res);
    expect(first.getData().statusCode).toBe(200);

    // 2nd request with exact same MessageSid -> rejected as duplicate replay
    const second = createMockRes();
    await handleWhatsAppWebhook(sendReq(), second.res);
    expect(second.getData().statusCode).toBe(403);
    expect(second.getData().body).toContain("Duplicate message replay detected");
  });

  // 3. Meta Signature Verification (Fail-Closed)
  it("accepts Meta request with valid X-Hub-Signature-256", async () => {
    const payload = JSON.stringify({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    from: "233241234567",
                    text: { body: "Your bank account has been suspended. Send your OTP and PIN now." },
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    const signature = signMetaPayload(payload);

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": signature,
      },
      body: payload,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    const parsed = JSON.parse(data.body);
    expect(parsed.ok).toBe(true);
    expect(parsed.analysis.riskLevel).toBe("HIGH");
    expect(parsed.replyPreview).toContain("ScamLens Alert: HIGH");
    expect(parsed.replyPreview).toContain("https://scam-lens-blue.vercel.app/result/an_");
  });

  it("rejects Meta request when X-Hub-Signature-256 is missing (401)", async () => {
    const payload = JSON.stringify({ text: "Hello" });
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(401);
    expect(data.body).toContain("Missing Meta webhook signature");
  });

  it("rejects Meta request when signature is invalid (403)", async () => {
    const payload = JSON.stringify({ text: "Hello" });
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": "sha256=invalidhex00000000000000000000000000000000000000000000000000000000",
      },
      body: payload,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  it("rejects Meta request when body is modified after signing (403)", async () => {
    const originalPayload = JSON.stringify({ text: "Original" });
    const signature = signMetaPayload(originalPayload);
    const tamperedPayload = JSON.stringify({ text: "Tampered" });

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": signature,
      },
      body: tamperedPayload,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  it("rejects Meta request with expired/stale timestamp (403)", async () => {
    // 30 minutes in the past (> 900s window)
    const staleTimestamp = Math.floor(Date.now() / 1000) - 1800;
    const payload = JSON.stringify({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    from: "233241234567",
                    text: { body: "Old replay test" },
                    timestamp: staleTimestamp.toString(),
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    const signature = signMetaPayload(payload);

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": signature,
      },
      body: payload,
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
    expect(data.body).toContain("Message timestamp expired");
  });

  // 4. Guarantee: Downstream AI / Pipeline is NOT invoked on unauthenticated requests
  it("never executes analysis pipeline or downstream AI when signature is invalid", async () => {
    const pipelineSpy = vi.spyOn(pipelineModule, "executeAnalysisPipeline");

    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": "forged_signature",
      },
      body: "From=whatsapp%3A%2B233241234567&Body=Do+something+expensive",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
    expect(pipelineSpy).not.toHaveBeenCalled();

    pipelineSpy.mockRestore();
  });
});
