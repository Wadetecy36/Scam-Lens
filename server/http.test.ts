import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import http from "node:http";
import { isOriginAllowed } from "./http.js";
import { createAppServer } from "./index.js";

describe("isOriginAllowed", () => {
  it("allows local dev and preview origins", () => {
    expect(isOriginAllowed("http://localhost:5173")).toBe(true);
    expect(isOriginAllowed("http://localhost:4173")).toBe(true);
    expect(isOriginAllowed("http://127.0.0.1:5173")).toBe(true);
  });

  it("allows the production site, with or without a trailing slash", () => {
    expect(isOriginAllowed("https://scam-lens-blue.vercel.app")).toBe(true);
    expect(isOriginAllowed("https://scam-lens-blue.vercel.app/")).toBe(true);
  });

  it("rejects lookalikes of the production site", () => {
    expect(isOriginAllowed("https://scam-lens-blue.vercel.app.evil.com")).toBe(false);
    expect(isOriginAllowed("http://scam-lens-blue.vercel.app")).toBe(false);
    expect(isOriginAllowed("https://scam-lens-red.vercel.app")).toBe(false);
  });

  it("allows requests with no Origin header (curl / server-to-server)", () => {
    expect(isOriginAllowed(undefined)).toBe(true);
  });

  it("rejects unknown origins", () => {
    expect(isOriginAllowed("https://evil-phishing.com")).toBe(false);
    expect(isOriginAllowed("null")).toBe(false);
  });

  it("rejects lookalike origins that merely contain an allowed one", () => {
    expect(isOriginAllowed("http://localhost:5173.evil.com")).toBe(false);
    expect(isOriginAllowed("https://localhost:5173")).toBe(false);
    expect(isOriginAllowed("http://localhost:51730")).toBe(false);
  });

  it("tolerates a trailing slash", () => {
    expect(isOriginAllowed("http://localhost:5173/")).toBe(true);
  });

  it("honours a custom allowlist", () => {
    expect(isOriginAllowed("https://scamlens.app", ["https://scamlens.app"])).toBe(true);
    expect(isOriginAllowed("https://other.app", ["https://scamlens.app"])).toBe(false);
  });
});

describe("CORS over real HTTP", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    server = createAppServer();
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    await new Promise<void>((r) => server.close(() => r()));
  });

  // node:http lets us set Origin freely (fetch/undici may not).
  function request(method: string, path: string, origin?: string) {
    return new Promise<{ status: number; headers: http.IncomingHttpHeaders }>((resolve, reject) => {
      const req = http.request(
        { host: "127.0.0.1", port, method, path, headers: origin ? { Origin: origin } : {} },
        (res) => {
          res.resume();
          res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers }));
        },
      );
      req.on("error", reject);
      req.end();
    });
  }

  it("answers an allowed origin with matching CORS headers", async () => {
    const r = await request("GET", "/api/health", "http://localhost:5173");
    expect(r.status).toBe(200);
    expect(r.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("returns 403 and NO CORS headers for an untrusted origin", async () => {
    const r = await request("GET", "/api/health", "https://evil-phishing.com");
    expect(r.status).toBe(403);
    expect(r.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("blocks the preflight from an untrusted origin", async () => {
    const r = await request("OPTIONS", "/api/analyze", "https://evil-phishing.com");
    expect(r.status).toBe(403);
    expect(r.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("passes the preflight from an allowed origin", async () => {
    const r = await request("OPTIONS", "/api/analyze", "http://localhost:4173");
    expect(r.status).toBe(204);
    expect(r.headers["access-control-allow-origin"]).toBe("http://localhost:4173");
  });

  it("still serves requests that send no Origin header", async () => {
    const r = await request("GET", "/api/health");
    expect(r.status).toBe(200);
  });
});
