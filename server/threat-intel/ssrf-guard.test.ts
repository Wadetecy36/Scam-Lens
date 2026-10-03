import { describe, expect, it } from "vitest";
import { isSafePublicUrl } from "./ssrf-guard.js";

describe("isSafePublicUrl SSRF Guard", () => {
  it("allows normal public http and https URLs", () => {
    expect(isSafePublicUrl("https://example.com")).toBe(true);
    expect(isSafePublicUrl("https://google.com/search?q=test")).toBe(true);
    expect(isSafePublicUrl("http://sub.domain.org/path")).toBe(true);
  });

  it("blocks non-http/https protocols", () => {
    expect(isSafePublicUrl("file:///etc/passwd")).toBe(false);
    expect(isSafePublicUrl("ftp://example.com")).toBe(false);
    expect(isSafePublicUrl("javascript:alert(1)")).toBe(false);
  });

  it("blocks localhost and loopback addresses", () => {
    expect(isSafePublicUrl("http://localhost:3000")).toBe(false);
    expect(isSafePublicUrl("http://test.localhost/")).toBe(false);
    expect(isSafePublicUrl("http://127.0.0.1:8080")).toBe(false);
    expect(isSafePublicUrl("http://[::1]:8080")).toBe(false);
  });

  it("blocks private IPv4 ranges", () => {
    expect(isSafePublicUrl("http://10.0.0.1")).toBe(false);
    expect(isSafePublicUrl("http://10.255.0.1/admin")).toBe(false);
    expect(isSafePublicUrl("http://192.168.1.1")).toBe(false);
    expect(isSafePublicUrl("http://172.16.0.1")).toBe(false);
    expect(isSafePublicUrl("http://172.24.1.5")).toBe(false);
    expect(isSafePublicUrl("http://172.31.255.254")).toBe(false);
  });

  it("blocks link-local and cloud metadata addresses", () => {
    expect(isSafePublicUrl("http://169.254.169.254/latest/meta-data/")).toBe(false);
    expect(isSafePublicUrl("http://metadata.google.internal/computeMetadata/v1/")).toBe(false);
  });

  it("blocks internal hostnames", () => {
    expect(isSafePublicUrl("http://internal-service.local")).toBe(false);
    expect(isSafePublicUrl("http://db.internal")).toBe(false);
    expect(isSafePublicUrl("http://vault.corp")).toBe(false);
  });
});
