import type { IncomingMessage, ServerResponse } from "node:http";

export function setSecurityHeaders(res: ServerResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
}

export function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader("Vary", "Origin");
  }
}

export function handleCorsPreflight(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  if (req.method === "OPTIONS") {
    setSecurityHeaders(res);
    setCorsHeaders(req, res);
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
) {
  setSecurityHeaders(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function sendError(
  res: ServerResponse,
  status: number,
  code: string,
  message: string,
) {
  sendJson(res, status, {
    ok: false,
    error: {
      code,
      message,
    },
  });
}
