export type ThreatVerdict =
  | "malicious"
  | "suspicious"
  | "clean"
  | "unknown";

export interface ThreatEvidence {
  provider: string;
  verdict: ThreatVerdict;
  threatScore: number; // 0 to 100
  details?: string;
  checkedAt: string;
}

export interface ThreatIntelligenceProvider {
  readonly name: string;
  isConfigured(): boolean;
  checkUrl(url: string): Promise<ThreatEvidence | null>;
}
