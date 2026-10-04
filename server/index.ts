import { createServer, type Server } from "node:http";
import { env } from "./env.js";
import { handleRequest } from "./app.js";

export function createAppServer(): Server {
  return createServer((req, res) => {
    void handleRequest(req, res);
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
