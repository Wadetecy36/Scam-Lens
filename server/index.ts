import { createServer } from "node:http";
import { env } from "./env.js";
import { sendError, sendJson } from "./http.js";
import { handleAnalyze } from "./routes/analyze.js";

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        service: "scamlens-api",
        phase: "2A",
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/analyze") {
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

server.listen(env.port, () => {
  console.log(
    `ScamLens API running on http://localhost:${env.port}`,
  );
});
