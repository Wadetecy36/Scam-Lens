import { describe, expect, it } from "vitest";
import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleWhatsAppWebhook, formatWhatsAppReply } from "./whatsapp.js";

function createMockReq(options: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}): IncomingMessage {
  const emitter = new EventEmitter() as any;
  emitter.method = options.method;
  emitter.url = options.url;
  emitter.headers = options.headers || {};
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

describe("WhatsApp Webhook", () => {
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

  it("rejects Meta webhook verification on token mismatch", async () => {
    const req = createMockReq({
      method: "GET",
      url: "/api/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=fail",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(403);
  });

  it("responds with welcome TwiML when Twilio forwards an empty message", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "From=whatsapp%3A%2B233241234567&Body=",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    expect(data.headers["content-type"]).toContain("application/xml");
    expect(data.body).toContain("<Response>");
    expect(data.body).toContain("Welcome to ScamLens");
  });

  it("analyzes a forwarded MoMo reversal scam and returns TwiML with HIGH risk warning", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "From=whatsapp%3A%2B233241234567&Body=Payment+received+for+GHS+500+from+KWAME.+Please+reverse+the+mistaken+transfer+immediately.",
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    expect(data.headers["content-type"]).toContain("application/xml");
    expect(data.body).toContain("<Response>");
    expect(data.body).toContain("ScamLens Alert: HIGH");
    expect(data.body).toContain("What to do");
  });

  it("processes direct JSON payloads and provides a WhatsApp-ready preview", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/whatsapp",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: "Your bank account has been suspended. Send your OTP and PIN now.",
        from: "+233241234567",
      }),
    });
    const { res, getData } = createMockRes();

    await handleWhatsAppWebhook(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    const parsed = JSON.parse(data.body);
    expect(parsed.ok).toBe(true);
    expect(parsed.analysis.riskLevel).toBe("HIGH");
    expect(parsed.replyPreview).toContain("ScamLens Alert: HIGH");
  });
});
