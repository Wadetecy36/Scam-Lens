import { createServer, type Server } from "node:http";
import { env } from "./env.js";
import { handleCorsPreflight, sendError, sendJson, setCorsHeaders } from "./http.js";
import { handleAnalyze } from "./routes/analyze.js";
import { checkRateLimit } from "./middleware/rate-limiter.js";

export function createAppServer(): Server {
  return createServer(async (req, res) => {
    try {
      setCorsHeaders(req, res);

      if (handleCorsPreflight(req, res)) {
        return;
      }

      if (req.method === "GET" && req.url === "/api/health") {
        sendJson(res, 200, {
          ok: true,
          service: "scamlens-api",
          phase: "2A",
        });
        return;
      }

      if (req.method === "POST" && req.url === "/api/analyze") {
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
  });
}

export const server = createAppServer();

if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  server.listen(env.port, () => {
    console.log(
      `ScamLens API running on http://localhost:${env.port}`,
    );
  });
}
