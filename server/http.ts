import type { IncomingMessage, ServerResponse } from "node:http";
import { env } from "./env.js";

export function setSecurityHeaders(res: ServerResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
}

/**
 * Requests with no Origin header (curl, server-to-server, same-origin GET)
 * are not browser cross-origin calls, so they are allowed. Any request that
 * does send an Origin must be on the allowlist.
 */
export function isOriginAllowed(
  origin: string | undefined,
  allowed: readonly string[] = env.allowedOrigins,
): boolean {
  if (!origin) return true;
  return allowed.includes(origin.replace(/\/+$/, ""));
}

export function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
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

export function sendXml(
  res: ServerResponse,
  status: number,
  xml: string,
) {
  setSecurityHeaders(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.end(xml);
}

export function sendText(
  res: ServerResponse,
  status: number,
  text: string,
) {
  setSecurityHeaders(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
}
