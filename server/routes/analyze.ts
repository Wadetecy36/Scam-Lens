import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "../http.js";
import { parseAnalyzeRequest } from "../validation/analyze.js";

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

export async function handleAnalyze(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const body = await readBody(req);
    const input = parseAnalyzeRequest(body);

    sendJson(res, 200, {
      ok: true,
      status: "accepted",
      input: {
        type: input.type,
        length: input.content.length,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Invalid analysis request.";

    sendError(res, 400, "INVALID_REQUEST", message);
  }
}
