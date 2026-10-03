import { env } from "../env.js";
import { isSafePublicUrl } from "./ssrf-guard.js";
import type { ThreatEvidence, ThreatIntelligenceProvider } from "./types.js";

const VT_TIMEOUT_MS = 5000;

export class VirusTotalProvider implements ThreatIntelligenceProvider {
  readonly name = "virustotal";

  isConfigured(): boolean {
    return Boolean(env.virustotalApiKey && env.virustotalApiKey.trim().length > 0);
  }

  async checkUrl(url: string): Promise<ThreatEvidence | null> {
    if (!this.isConfigured() || !isSafePublicUrl(url)) {
      return null;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VT_TIMEOUT_MS);

    try {
      // VirusTotal v3 requires URL identifier as base64 without padding ('=' stripped)
      const urlId = Buffer.from(url)
        .toString("base64")
        .replace(/=+$/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      const response = await fetch(
        `https://www.virustotal.com/api/v3/urls/${urlId}`,
        {
          method: "GET",
          headers: {
            "x-apikey": env.virustotalApiKey,
            Accept: "application/json",
          },
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        data?: {
          attributes?: {
            last_analysis_stats?: {
              malicious?: number;
              suspicious?: number;
              harmless?: number;
              undetected?: number;
            };
          };
        };
      };

      const stats = data?.data?.attributes?.last_analysis_stats;
      if (!stats) return null;

      const malicious = stats.malicious ?? 0;
      const suspicious = stats.suspicious ?? 0;
      const total =
        malicious + suspicious + (stats.harmless ?? 0) + (stats.undetected ?? 0);

      let verdict: ThreatEvidence["verdict"] = "clean";
      let threatScore = 0;

      if (malicious >= 3) {
        verdict = "malicious";
        threatScore = Math.min(100, 50 + malicious * 10);
      } else if (malicious > 0 || suspicious >= 2) {
        verdict = "suspicious";
        threatScore = 40 + suspicious * 5;
      }

      return {
        provider: this.name,
        verdict,
        threatScore,
        details: `${malicious} malicious / ${suspicious} suspicious detections out of ${total} security engines`,
        checkedAt: new Date().toISOString(),
      };
    } catch {
      // Fail closed / silent so third-party downtime never crashes ScamLens
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
}
