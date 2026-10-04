import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "../http.js";
import { getPublicResult } from "../services/result-store.js";
import { checkRateLimit } from "../middleware/rate-limiter.js";

const ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;

export async function handleGetResult(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET requests are supported.");
    return;
  }

  // Security: Prevent crawlers and search engine indexing of shared security results
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");

  // Format validation to prevent path traversal or malformed queries
  if (!id || !ID_PATTERN.test(id)) {
    sendError(res, 400, "INVALID_ID", "Invalid result ID format.");
    return;
  }

  // Rate limit to prevent automated enumeration attacks
  if (checkRateLimit(req, res)) {
    return;
  }

  try {
    const result = await getPublicResult(id);

    if (!result) {
      sendError(
        res,
        404,
        "RESULT_NOT_FOUND",
        "This result was not found or has expired.",
      );
      return;
    }

    sendJson(res, 200, {
      ok: true,
      result,
    });
  } catch (error) {
    console.error(`[results] Failed to retrieve result ${id}:`, error);
    sendError(
      res,
      500,
      "RETRIEVAL_ERROR",
      "Failed to retrieve the requested result.",
    );
  }
}
