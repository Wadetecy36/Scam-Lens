/**
 * Strict, versioned schema for scam analysis results.
 *
 * This is the ONLY shape allowed to reach the UI. Raw AI provider output is
 * never rendered directly — it must be parsed and validated against this
 * schema first (see validators.ts). This keeps a misbehaving or
 * unexpectedly-formatted model response from being able to control the UI.
 */

export const RISK_LEVELS = ["LOW", "CAUTION", "SUSPICIOUS", "HIGH"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const WARNING_SIGN_SEVERITIES = ["low", "medium", "high"] as const;
export type WarningSignSeverity = (typeof WARNING_SIGN_SEVERITIES)[number];

export const ANALYSIS_INPUT_TYPES = ["message", "image", "url", "call"] as const;
export type AnalysisInputType = (typeof ANALYSIS_INPUT_TYPES)[number];

/**
 * Scam categories the analyzer can recognize. Kept as a plain string union
 * with an "other" escape hatch so new categories can be added without
 * breaking previously-stored analyses.
 */
export const SCAM_CATEGORIES = [
  "phishing",
  "impersonation",
  "fake_prize",
  "fake_job_offer",
  "investment_scam",
  "romance_scam",
  "payment_scam",
  "banking_scam",
  "account_takeover",
  "credential_harvesting",
  "fake_customer_support",
  "delivery_scam",
  "government_impersonation",
  "charity_scam",
  "emergency_scam",
  "extortion",
  "marketplace_scam",
  "malicious_link",
  "social_engineering",
  "advance_fee_scam",
  "other",
] as const;
export type ScamCategory = (typeof SCAM_CATEGORIES)[number];

export interface WarningSign {
  type: string;
  severity: WarningSignSeverity;
  explanation: string;
}

/** The four required plain-language explanation registers (see spec #10). */
export interface ExplanationSet {
  technical: string;
  simple: string;
  family: string;
  voice: string;
}

export interface ScamAnalysis {
  /** Schema/version marker for forward compatibility. */
  schemaVersion: 1;
  id: string;
  inputType: AnalysisInputType;
  category: ScamCategory;
  riskScore: number; // 0–100, internal precision
  riskLevel: RiskLevel;
  summary: string;
  warningSigns: WarningSign[];
  recommendedActions: string[];
  avoidActions: string[];
  explanations: ExplanationSet;
  /** Model's stated confidence, 0–1. Analysis must never be presented as infallible. */
  confidence: number;
  createdAt: string; // ISO timestamp
}

export interface ScamAnalysisInput {
  type: AnalysisInputType;
  /** Raw pasted text, call description, or OCR-extracted text. */
  text?: string;
  /** Submitted URL (validated server-side; never auto-fetched from the client). */
  url?: string;
  /** Reference to an uploaded, not-yet-analyzed image (never sent as a data URI to the client). */
  imageRef?: string;
  locale?: string;
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return "HIGH";
  if (score >= 50) return "SUSPICIOUS";
  if (score >= 25) return "CAUTION";
  return "LOW";
}

export const RISK_LEVEL_COPY: Record<RiskLevel, { label: string; description: string }> = {
  LOW: {
    label: "Low risk",
    description: "We didn't find warning signs, but always trust your judgment.",
  },
  CAUTION: {
    label: "Caution",
    description: "A few things are worth a second look before you act.",
  },
  SUSPICIOUS: {
    label: "Suspicious",
    description: "This has several signs commonly seen in scams.",
  },
  HIGH: {
    label: "High risk",
    description: "This strongly resembles a scam. We recommend not continuing.",
  },
};
