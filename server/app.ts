import type { IncomingMessage, ServerResponse } from "node:http";
import { isOriginAllowed, sendError, sendJson, setCorsHeaders, handleCorsPreflight } from "./http.js";
import { handleAnalyze } from "./routes/analyze.js";
import { handleWhatsAppWebhook } from "./routes/whatsapp.js";
import { checkRateLimit } from "./middleware/rate-limiter.js";

/**
 * Single request handler shared by the local Node server (server/index.ts)
 * and the Vercel serverless functions (api/*.ts), so both behave identically:
 * origin allowlist -> CORS -> rate limit -> route.
 */
export async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    if (!isOriginAllowed(req.headers.origin)) {
      sendError(res, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed to use the ScamLens API.");
      return;
    }

    setCorsHeaders(req, res);

    if (handleCorsPreflight(req, res)) {
      return;
    }

    // Ignore any query string when routing.
    const path = (req.url ?? "").split("?")[0];

    if (req.method === "GET" && path === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        service: "scamlens-api",
        phase: "2A",
      });
      return;
    }

    if (path === "/api/whatsapp" || path === "/api/whatsapp/webhook") {
      await handleWhatsAppWebhook(req, res);
      return;
    }

    if (req.method === "POST" && path === "/api/analyze") {
      if (checkRateLimit(req, res)) return;
      await handleAnalyze(req, res);
      return;
    }

    sendError(
      res,
      404,
      "NOT_FOUND",
      "The requested endpoint was not found.",
    );
  } catch (error) {
    console.error("Unhandled server error:", error);

    sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "An unexpected server error occurred.",
    );
  }
}
