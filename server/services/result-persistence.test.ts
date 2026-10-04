import { describe, expect, it, beforeEach } from "vitest";
import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  generateResultId,
  sanitizeAnalysisForStorage,
  savePublicResult,
  getPublicResult,
  deletePublicResult,
} from "./result-store.js";
import { handleGetResult } from "../routes/results.js";
import { handleAnalyze } from "../routes/analyze.js";
import type { ScamAnalysis } from "../../src/ai/scam-analysis/schema.js";

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
    host: "localhost:3001",
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

const mockAnalysis: ScamAnalysis = {
  schemaVersion: 1,
  id: "an_test_sample_12345",
  inputType: "message",
  category: "banking_scam",
  riskScore: 92,
  riskLevel: "HIGH",
  summary: "This message impersonates your bank to steal your credentials.",
  warningSigns: [
    {
      type: "credential_request",
      explanation: "Demands personal banking PIN and password.",
      severity: "high",
    },
  ],
  recommendedActions: [
    "Never share your Mobile Money PIN with anyone.",
  ],
  avoidActions: [
    "Do not click the link or approve any prompt.",
  ],
  confidence: 0.95,
  createdAt: new Date().toISOString(),
  explanations: {
    simple: "The sender is pretending to be a bank agent to steal your funds.",
    technical: "Detected urgent credential harvesting signature with spoofed telecom header.",
    voice: "Warning! This message is an active fraud attempt. Do not share your PIN.",
  },
};

describe("Result Persistence & Sharing Security", () => {
  // 1. ID Generation Security
  it("generates cryptographically unguessable random IDs", () => {
    const id1 = generateResultId();
    const id2 = generateResultId();

    expect(id1).toMatch(/^an_[a-zA-Z0-9_-]{16,24}$/);
    expect(id2).toMatch(/^an_[a-zA-Z0-9_-]{16,24}$/);
    expect(id1).not.toBe(id2);

    // Sequential ID enumeration is impossible: 100 IDs generated have high entropy
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateResultId());
    }
    expect(ids.size).toBe(100);
  });

  // 2. Privacy & Sanitization: No raw PII or secret credentials persisted
  it("sanitizes analysis for storage without exposing raw user text, phone numbers, or passwords", () => {
    const sanitized = sanitizeAnalysisForStorage(mockAnalysis, undefined, "web");

    expect(sanitized.id).toBe(mockAnalysis.id);
    expect(sanitized.riskLevel).toBe("HIGH");
    expect(sanitized.riskScore).toBe(92);
    expect(sanitized.expiresAt).toBeDefined();

    // Verify raw input fields are completely absent from the sanitized storage schema
    const rawKeys = Object.keys(sanitized);
    expect(rawKeys).not.toContain("rawText");
    expect(rawKeys).not.toContain("rawInput");
    expect(rawKeys).not.toContain("phoneNumber");
    expect(rawKeys).not.toContain("otp");
    expect(rawKeys).not.toContain("password");
    expect(rawKeys).not.toContain("content");
  });

  // 3. Storage and Retrieval Lifecycle
  it("persists a sanitized result and retrieves it accurately across sessions", async () => {
    const customId = `an_persist_${Date.now()}_test`;
    const toSave = sanitizeAnalysisForStorage({ ...mockAnalysis, id: customId }, undefined, "web");

    await savePublicResult(toSave);

    const retrieved = await getPublicResult(customId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(customId);
    expect(retrieved?.riskScore).toBe(92);
    expect(retrieved?.summary).toContain("impersonates your bank");

    await deletePublicResult(customId);
  });

  it("returns null for non-existent result IDs", async () => {
    const nonExistent = await getPublicResult("an_definitely_does_not_exist_9999");
    expect(nonExistent).toBeNull();
  });

  it("rejects expired result records", async () => {
    const expiredId = `an_expired_${Date.now()}`;
    // Create result with negative TTL (-1 hour)
    const expiredResult = sanitizeAnalysisForStorage(
      { ...mockAnalysis, id: expiredId },
      undefined,
      "web",
      -3600 * 1000,
    );

    await savePublicResult(expiredResult);

    // Reading an expired result must return null
    const result = await getPublicResult(expiredId);
    expect(result).toBeNull();
  });

  // 4. HTTP API Route: GET /api/results/:id
  it("GET /api/results/:id returns 200 with sanitized result for valid ID", async () => {
    const testId = `an_http_get_${Date.now()}`;
    const toSave = sanitizeAnalysisForStorage({ ...mockAnalysis, id: testId });
    await savePublicResult(toSave);

    const req = createMockReq({
      method: "GET",
      url: `/api/results/${testId}`,
    });
    const { res, getData } = createMockRes();

    await handleGetResult(req, res, testId);
    const data = getData();

    expect(data.statusCode).toBe(200);
    expect(data.headers["x-robots-tag"]).toBe("noindex, nofollow");
    expect(data.headers["cache-control"]).toContain("no-store");

    const parsed = JSON.parse(data.body);
    expect(parsed.ok).toBe(true);
    expect(parsed.result.id).toBe(testId);
    expect(parsed.result.riskLevel).toBe("HIGH");

    // Clean up
    await deletePublicResult(testId);
  });

  it("GET /api/results/:id returns 404 for unknown or expired ID", async () => {
    const req = createMockReq({
      method: "GET",
      url: "/api/results/an_unknown_id_404",
    });
    const { res, getData } = createMockRes();

    await handleGetResult(req, res, "an_unknown_id_404");
    const data = getData();

    expect(data.statusCode).toBe(404);
    const parsed = JSON.parse(data.body);
    expect(parsed.error.code).toBe("RESULT_NOT_FOUND");
  });

  it("GET /api/results/:id returns 400 for malformed IDs (path traversal attempt)", async () => {
    const req = createMockReq({
      method: "GET",
      url: "/api/results/../../../etc/passwd",
    });
    const { res, getData } = createMockRes();

    await handleGetResult(req, res, "../../../etc/passwd");
    const data = getData();

    expect(data.statusCode).toBe(400);
    const parsed = JSON.parse(data.body);
    expect(parsed.error.code).toBe("INVALID_ID");
  });

  // 5. Integration: POST /api/analyze automatically persists sanitized result
  it("POST /api/analyze creates a persistent result accessible via GET /api/results/:id", async () => {
    const req = createMockReq({
      method: "POST",
      url: "/api/analyze",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: "MTN MoMo Alert: Transfer of GHS 500 received. Approve prompt or call 0241234567.",
        type: "message",
      }),
    });
    const { res, getData } = createMockRes();

    await handleAnalyze(req, res);
    const data = getData();

    expect(data.statusCode).toBe(200);
    const parsed = JSON.parse(data.body);
    expect(parsed.ok).toBe(true);
    const resultId = parsed.analysis.id;
    expect(resultId).toMatch(/^an_/);

    // Verify it is immediately retrievable through the persistent store
    const persistent = await getPublicResult(resultId);
    expect(persistent).not.toBeNull();
    expect(persistent?.id).toBe(resultId);
    expect(persistent?.riskLevel).toBe(parsed.analysis.riskLevel);

    // Clean up
    await deletePublicResult(resultId);
  });
});
