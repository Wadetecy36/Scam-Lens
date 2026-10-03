import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError } from "../http.js";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store for IP addresses
const requestStore = new Map<string, RateLimitInfo>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 10;     // Max 10 requests per minute

/**
 * Sweeps expired IPs from the store every 2 minutes
 * to prevent memory leaks in the Map.
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of requestStore.entries()) {
    if (now > info.resetTime) {
      requestStore.delete(ip);
    }
  }
}, 2 * 60 * 1000).unref(); // unref so it doesn't keep the process alive

export function checkRateLimit(req: IncomingMessage, res: ServerResponse): boolean {
  // Allow test suites to benchmark without rate limiting
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return false;
  }

  // Use X-Forwarded-For if behind a proxy, otherwise socket remoteAddress
  const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";
  const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();

  const now = Date.now();
  let info = requestStore.get(ip);

  // If IP isn't in store or window has expired, reset
  if (!info || now > info.resetTime) {
    info = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  info.count += 1;
  requestStore.set(ip, info);

  // Set standard rate limit headers
  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - info.count));
  res.setHeader("X-RateLimit-Reset", Math.ceil(info.resetTime / 1000));

  if (info.count > MAX_REQUESTS) {
    sendError(
      res,
      429,
      "TOO_MANY_REQUESTS",
      "You have exceeded the maximum number of analysis requests. Please wait a minute and try again."
    );
    return true; // Limit exceeded
  }

  return false; // Allowed
}
