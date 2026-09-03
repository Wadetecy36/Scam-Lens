import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "../http.js";
import { parseAnalyzeRequest } from "../validation/analyze.js";
import { getAIProvider } from "../providers/index.js";
import type { ScamAnalysisInput } from "../../src/ai/scam-analysis/schema.js";

const MAX_BODY_BYTES = 25_000;

async function readBody(req: IncomingMessage): Promise<unknown> {
  let data = "";
  let size = 0;

  for await (const chunk of req) {
    const text = chunk.toString();
    size += Buffer.byteLength(text);

    if (size > MAX_BODY_BYTES) {
      throw new Error("Request body is too large.");
    }

    data += text;
  }

  if (!data.trim()) {
    throw new Error("Request body is required.");
  }

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("Request body must contain valid JSON.");
  }
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
    const aiInput = toAIInput(input);

    const provider = getAIProvider();
    const analysis = await provider.analyzeScam(aiInput);

    sendJson(res, 200, {
      ok: true,
      analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Analysis request failed.";

    if (
      message.includes("not configured")
    ) {
      sendError(
        res,
        503,
        "AI_NOT_CONFIGURED",
        "The AI analysis service is not configured.",
      );
      return;
    }

    if (
      message.includes("timed out")
    ) {
      sendError(
        res,
        504,
        "AI_TIMEOUT",
        "The analysis service took too long to respond.",
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
        "The analysis service returned an invalid response.",
      );
      return;
    }

    console.error("Analysis request error:", error);

    sendError(
      res,
      502,
      "AI_ANALYSIS_FAILED",
      "We could not complete the analysis right now.",
    );
  }
}
