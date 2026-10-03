import type { DetectedSignal, RiskSignal } from "./signals.js";

export type RiskLevel =
  | "LOW"
  | "CAUTION"
  | "SUSPICIOUS"
  | "HIGH";

export interface RiskScore {
  score: number;
  level: RiskLevel;
  signals: DetectedSignal[];
}

export const SIGNAL_WEIGHTS: Record<RiskSignal, number> = {
  urgency: 15,
  threat: 20,
  credential_request: 25,
  payment_request: 25,
  suspicious_link: 20,
  impersonation: 20,
  prize_or_reward: 15,
  investment_promise: 20,
  too_good_to_be_true: 15,
  fake_document: 85,

  // Benchmark weights
  AUTHORITY_IMPERSONATION: 45,
  FEAR_COERCION: 45,
  TYPOSQUATTING_DOMAIN: 45,
  MFA_OTP_SOLICITATION: 45,
  IRREVERSIBLE_PAYMENT_DEMAND: 45,
  REMOTE_ACCESS_PROMPT: 45,
  SYNTHETIC_DOCUMENT_MARKER: 45,
  ARITHMETIC_MISMATCH: 45,
  RAPID_LAYERING: 25,
  INVALID_ABA_CHECKSUM: 25,
  URGENCY_ARTIFICIAL: 25,
  GREED_INCENTIVE: 25,
  URL_OBFUSCATION: 25,
  OFF_PLATFORM_DIVERSION: 25,
  HOMOGLYPH_UNICODE_ATTACK: 25,
  ADVANCE_FEE_SOLICITATION: 25,
  RELATIONSHIP_HIJACK: 10,
  UNSTRUCTURED_CONTACT_INFO: 10,
};

export const HARD_TRIPWIRES: RiskSignal[] = [
  "fake_document",
  "MFA_OTP_SOLICITATION",
  "REMOTE_ACCESS_PROMPT",
  "TYPOSQUATTING_DOMAIN",
  "SYNTHETIC_DOCUMENT_MARKER",
  "ARITHMETIC_MISMATCH",
];

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return "HIGH";
  if (score >= 50) return "SUSPICIOUS";
  if (score >= 25) return "CAUTION";
  return "LOW";
}

export function scoreSignals(
  signals: Array<Omit<DetectedSignal, "weight">>,
): RiskScore {
  const weightedSignals = signals.map((signal) => ({
    ...signal,
    weight: SIGNAL_WEIGHTS[signal.signal] ?? 10,
  }));

  let score = weightedSignals.reduce((total, signal) => total + signal.weight, 0);
  const flagCodes = signals.map((s) => s.signal);

  // Compound modifier: urgency + irreversible payment or off-platform diversion
  const hasUrgency = flagCodes.includes("URGENCY_ARTIFICIAL");
  const hasPaymentOrDiversion =
    flagCodes.includes("IRREVERSIBLE_PAYMENT_DEMAND") ||
    flagCodes.includes("OFF_PLATFORM_DIVERSION");
  if (hasUrgency && hasPaymentOrDiversion) {
    score = score * 1.3;
  }

  score = Math.min(100, Math.round(score));
  let level = riskLevelFromScore(score);

  // Tripwires force HIGH and minimum score 85
  const tripwireHit = flagCodes.some((code) => HARD_TRIPWIRES.includes(code));
  if (tripwireHit) {
    level = "HIGH";
    score = Math.max(score, 85);
  }

  return {
    score,
    level,
    signals: weightedSignals,
  };
}
