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

const SIGNAL_WEIGHTS: Record<RiskSignal, number> = {
  urgency: 15,
  threat: 20,
  credential_request: 25,
  payment_request: 25,
  suspicious_link: 20,
  impersonation: 20,
  prize_or_reward: 15,
  investment_promise: 20,
  too_good_to_be_true: 15,
};

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
    weight: SIGNAL_WEIGHTS[signal.signal],
  }));

  const score = Math.min(
    100,
    weightedSignals.reduce((total, signal) => total + signal.weight, 0),
  );

  return {
    score,
    level: riskLevelFromScore(score),
    signals: weightedSignals,
  };
}
