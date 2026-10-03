import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "../http.js";
import { parseAnalyzeRequest, ValidationError } from "../validation/analyze.js";
import { getAIProvider } from "../providers/index.js";
import { analyzeCombinedRisk } from "../risk/engine.js";
import { redactPII } from "../privacy/pii-redactor.js";
import type { ScamAnalysisInput } from "../../src/ai/scam-analysis/schema.js";

const MAX_BODY_BYTES = 25_000;

async function readBody(req: IncomingMessage): Promise<unknown> {
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

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

function toAIInput(
  input: ReturnType<typeof parseAnalyzeRequest>,
): ScamAnalysisInput {
  switch (input.type) {
    case "message":
      return {
        type: "message",
        text: input.content,
      };

    case "screenshot":
      return {
        type: "image",
        text: input.content,
      };

    case "url":
      return {
        type: "url",
        url: input.content,
      };

    case "call":
      return {
        type: "call",
        text: input.content,
      };
  }
}

export async function handleAnalyze(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const body = await readBody(req);
    const input = parseAnalyzeRequest(body);
    const content = input.content;

    // PRE-FLIGHT: Prompt Injection & Jailbreak Defense Heuristics
    // Reject obvious instruction-override attempts before paying for AI tokens.
    const injectionPatterns = [
      /ignore.*?instructions/i,
      /forget.*?instructions/i,
      /ignore.*?rules/i,
      /ignore.*?directions/i,
      /system prompt/i,
      /bypass rules/i,
      /you are now a/i,
      /print.*?instructions/i,
      /print.*?prompt/i
    ];

    if (injectionPatterns.some(pattern => pattern.test(content))) {
      throw new ValidationError("Input rejected: Potential prompt injection or jailbreak attempt detected.");
    }

    const provider = getAIProvider();

    // PRIVACY: scrub personal data from the copy that leaves our server.
    // URLs are the evidence themselves, so they are sent as-is.
    const redaction =
      input.type === "url"
        ? { text: content, counts: {} }
        : redactPII(content);
    const aiInput = toAIInput({ ...input, content: redaction.text });

    const redactedTotal = Object.values(redaction.counts).reduce((a, b) => a + (b ?? 0), 0);
    if (redactedTotal > 0) {
      // Counts only — never log the values.
      console.log("[privacy] redacted before AI call:", redaction.counts);
    }

    const aiAnalysis = await provider.analyzeScam(aiInput);

    /*
     * ScamLens owns the final risk decision.
     *
     * Gemini provides evidence.
     * The deterministic risk engine calculates
     * the final score and risk level.
     * (It runs locally on the original text, so no evidence is lost.)
     */
    const risk = analyzeCombinedRisk(
      content,
      aiAnalysis,
    );

    const analysis = {
      ...aiAnalysis,
      riskScore: risk.score,
      riskLevel: risk.level,
    };

    sendJson(res, 200, {
      ok: true,
      analysis,
      privacy: { redactions: redaction.counts },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendError(res, 400, "BAD_REQUEST", error.message);
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unknown analysis error.";

    console.error("Analyze route error:", error);

    if (message.includes("not configured")) {
      sendError(
        res,
        503,
        "AI_NOT_CONFIGURED",
        "AI analysis is not configured.",
      );
      return;
    }

    if (message.includes("timed out")) {
      sendError(
        res,
        504,
        "AI_TIMEOUT",
        "AI analysis timed out.",
      );
      return;
    }

    if (
      message.includes("invalid JSON") ||
      message.includes("empty response")
    ) {
      sendError(
        res,
        502,
        "AI_INVALID_RESPONSE",
        "The AI returned an invalid response.",
      );
      return;
    }

    if (message === "Request body is too large.") {
      sendError(
        res,
        413,
        "REQUEST_TOO_LARGE",
        "The request is too large.",
      );
      return;
    }

    if (message === "Invalid JSON body.") {
      sendError(
        res,
        400,
        "INVALID_JSON",
        "The request body must contain valid JSON.",
      );
      return;
    }

    sendError(
      res,
      502,
      "AI_ANALYSIS_FAILED",
      "Scam analysis failed.",
    );
  }
}
