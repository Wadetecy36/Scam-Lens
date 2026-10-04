import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "../http.js";
import { parseAnalyzeRequest, ValidationError } from "../validation/analyze.js";
import { executeAnalysisPipeline } from "../services/analysis-pipeline.js";
import {
  sanitizeAnalysisForStorage,
  savePublicResult,
} from "../services/result-store.js";

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

export async function handleAnalyze(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const body = await readBody(req);
    const input = parseAnalyzeRequest(body);
    const { analysis, threatIntel, redactions } = await executeAnalysisPipeline(
      input.content,
      input.type,
    );

    // Persist sanitized result for shareable /result/:id links
    const sanitized = sanitizeAnalysisForStorage(analysis, threatIntel, "web");
    await savePublicResult(sanitized);

    analysis.id = sanitized.id;

    sendJson(res, 200, {
      ok: true,
      analysis,
      threatIntel: threatIntel.length > 0 ? threatIntel : undefined,
      privacy: { redactions },
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
