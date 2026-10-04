import { isSafePublicUrl } from "./ssrf-guard.js";
import type { ThreatEvidence, ThreatIntelligenceProvider } from "./types.js";

const TIMEOUT_MS = 4000;

export class PublicThreatIntelProvider implements ThreatIntelligenceProvider {
  readonly name = "public-url-intel";

  /**
   * Always configured — uses open public threat registry without requiring user API keys.
   */
  isConfigured(): boolean {
    return true;
  }

  async checkUrl(url: string): Promise<ThreatEvidence | null> {
    if (!isSafePublicUrl(url)) {
      return null;
    }

    try {
      const parsed = new URL(url);
      
      // Fast heuristic check for link shorteners (bit.ly, tinyurl, etc.)
      const isShortener = /(^|\.)(bit\.ly|tinyurl\.com|t\.co|is\.gd|ow\.ly|buff\.ly|rebrand\.ly)$/i.test(
        parsed.hostname,
      );

      if (isShortener) {
        return {
          provider: this.name,
          verdict: "suspicious",
          threatScore: 45,
          details: "Obfuscated via link shortener service. Attackers commonly use shorteners to mask deceptive destinations.",
          checkedAt: new Date().toISOString(),
        };
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const endpoint = `https://presend.pages.dev/api/url-reputation?url=${encodeURIComponent(url)}`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "ScamLens-ThreatIntel/1.0 (https://scam-lens-blue.vercel.app)",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as {
          url?: string;
          malicious?: boolean;
          status?: string;
          threat?: string;
          note?: string;
        };

        if (data.malicious === true) {
          return {
            provider: this.name,
            verdict: "malicious",
            threatScore: 95,
            details: data.threat || data.note || "Flagged as an active threat in global public malware database (URLhaus).",
            checkedAt: new Date().toISOString(),
          };
        }

        return {
          provider: this.name,
          verdict: "clean",
          threatScore: 0,
          details: "No active threat detections found in public malware registries.",
          checkedAt: new Date().toISOString(),
        };
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Fail closed / silent so third-party downtime never crashes ScamLens
      return null;
    }
  }
}
