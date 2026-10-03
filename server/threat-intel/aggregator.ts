import type { ThreatEvidence, ThreatIntelligenceProvider } from "./types.js";
import { VirusTotalProvider } from "./virustotal-provider.js";
import { isSafePublicUrl } from "./ssrf-guard.js";

const providers: ThreatIntelligenceProvider[] = [
  new VirusTotalProvider(),
];

export async function aggregateThreatIntel(
  url: string,
): Promise<ThreatEvidence[]> {
  if (!isSafePublicUrl(url)) {
    return [];
  }

  const activeProviders = providers.filter((p) => p.isConfigured());
  if (activeProviders.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    activeProviders.map((p) => p.checkUrl(url)),
  );

  const evidence: ThreatEvidence[] = [];

  for (const res of results) {
    if (res.status === "fulfilled" && res.value) {
      evidence.push(res.value);
    }
  }

  return evidence;
}
