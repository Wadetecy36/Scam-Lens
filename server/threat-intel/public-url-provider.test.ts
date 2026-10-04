import { describe, expect, it, vi } from "vitest";
import { PublicThreatIntelProvider } from "./public-url-provider.js";

describe("PublicThreatIntelProvider", () => {
  const provider = new PublicThreatIntelProvider();

  it("is always configured without requiring API keys", () => {
    expect(provider.isConfigured()).toBe(true);
    expect(provider.name).toBe("public-url-intel");
  });

  it("blocks dangerous private IP addresses (SSRF guard)", async () => {
    const result = await provider.checkUrl("http://127.0.0.1:8080/admin");
    expect(result).toBeNull();
  });

  it("blocks AWS / GCP cloud metadata endpoints (SSRF guard)", async () => {
    const result = await provider.checkUrl("http://169.254.169.254/latest/meta-data/");
    expect(result).toBeNull();
  });

  it("identifies link shorteners as suspicious obfuscation without remote call", async () => {
    const result = await provider.checkUrl("https://bit.ly/3FakeLinkNotice");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.verdict).toBe("suspicious");
      expect(result.threatScore).toBeGreaterThanOrEqual(40);
      expect(result.details).toContain("link shortener");
    }
  });

  it("identifies malicious URLs when flagged by threat feed", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        url: "http://malicious-phish-domain.com",
        malicious: true,
        threat: "malware_download",
      }),
    } as Response);

    const result = await provider.checkUrl("http://malicious-phish-domain.com");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.verdict).toBe("malicious");
      expect(result.threatScore).toBeGreaterThanOrEqual(90);
      expect(result.details).toBe("malware_download");
    }

    fetchSpy.mockRestore();
  });

  it("handles clean URLs correctly", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        url: "https://example.com",
        malicious: false,
        status: "not_found",
      }),
    } as Response);

    const result = await provider.checkUrl("https://example.com");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.verdict).toBe("clean");
      expect(result.threatScore).toBe(0);
    }

    fetchSpy.mockRestore();
  });

  it("fails safely to null when upstream API is unreachable or times out", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network timeout"));

    const result = await provider.checkUrl("https://unreachable-domain.com");
    expect(result).toBeNull();

    fetchSpy.mockRestore();
  });
});
