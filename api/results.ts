import type { IncomingMessage, ServerResponse } from "node:http";
import { handleRequest } from "../server/app.js";

// Vercel serverless function: GET /api/results/:id
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleRequest(req, res);
}
