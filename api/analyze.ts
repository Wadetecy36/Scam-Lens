import type { IncomingMessage, ServerResponse } from "node:http";
import { handleRequest } from "../server/app.js";

// Vercel serverless function: POST /api/analyze
// maxDuration is set in vercel.json (Gemini calls can take up to ~20s).
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleRequest(req, res);
}
