import type {
  ScamAnalysis,
  ScamAnalysisInput,
  ScamCategory,
  WarningSign,
} from "../ai/scam-analysis/schema.js";
import { parseScamAnalysis } from "../ai/scam-analysis/validators.js";
import { analyzeSignals } from "./engine.js";
import type { DetectedSignal } from "./signals.js";

function inferCategory(content: string, signals: DetectedSignal[]): ScamCategory {
  const signalTypes = new Set(signals.map((s) => s.signal));
  const lower = content.toLowerCase();

  if (
    signalTypes.has("credential_request") ||
    signalTypes.has("MFA_OTP_SOLICITATION")
  ) {
    if (
      lower.includes("momo") ||
      lower.includes("bank") ||
      lower.includes("wallet")
    ) {
      return "banking_scam";
    }
    return "credential_harvesting";
  }

  if (
    signalTypes.has("payment_request") ||
    signalTypes.has("IRREVERSIBLE_PAYMENT_DEMAND")
  ) {
    if (
      lower.includes("momo") ||
      lower.includes("reversal") ||
      lower.includes("cash out")
    ) {
      return "payment_scam";
    }
    if (
      lower.includes("protocol") ||
      lower.includes("enlistment") ||
      lower.includes("recruitment")
    ) {
      return "advance_fee_scam";
    }
    return "payment_scam";
  }

  if (
    signalTypes.has("impersonation") ||
    signalTypes.has("AUTHORITY_IMPERSONATION")
  ) {
    if (
      lower.includes("police") ||
      lower.includes("gra") ||
      lower.includes("government") ||
      lower.includes("customs")
    ) {
      return "government_impersonation";
    }
    return "impersonation";
  }

  if (
    signalTypes.has("prize_or_reward") ||
    signalTypes.has("ADVANCE_FEE_SOLICITATION")
  ) {
    return "fake_prize";
  }

  if (signalTypes.has("investment_promise")) {
    return "investment_scam";
  }

  if (
    signalTypes.has("suspicious_link") ||
    signalTypes.has("TYPOSQUATTING_DOMAIN") ||
    signalTypes.has("URL_OBFUSCATION")
  ) {
    return "malicious_link";
  }

  if (signalTypes.has("threat") || signalTypes.has("FEAR_COERCION")) {
    return "emergency_scam";
  }

  return "other";
}

/**
 * Analyzes content completely offline in-browser using deterministic heuristics.
 * Requires zero internet data, zero API calls, and zero external services.
 */
export function analyzeOfflineScam(input: ScamAnalysisInput): ScamAnalysis {
  const content = input.type === "url" ? input.url ?? "" : input.text ?? "";
  const scoreResult = analyzeSignals(content);
  const category = inferCategory(content, scoreResult.signals);

  const warningSigns: WarningSign[] = scoreResult.signals.map((s) => ({
    type: s.signal,
    severity: s.weight >= 25 ? "high" : "medium",
    explanation: s.explanation,
  }));

  let recommendedActions: string[];
  let avoidActions: string[];

  if (scoreResult.level === "HIGH") {
    recommendedActions = [
      "Do not send money, reverse any transaction, or approve Mobile Money prompts.",
      "Never share your Mobile Money PIN, banking passwords, or OTP verification codes.",
      "Contact the person or company using an official phone number you already know, not any contact details sent in this message.",
      "Ask a trusted family member or friend for a second opinion before taking any action.",
    ];
    avoidActions = [
      "Do not click on any links in the message.",
      "Do not approve any authorization prompt on your phone.",
      "Do not forward this message to other people.",
    ];
  } else if (
    scoreResult.level === "SUSPICIOUS" ||
    scoreResult.level === "CAUTION"
  ) {
    recommendedActions = [
      "Pause and verify before replying or clicking any link.",
      "Check your account balance directly in your official banking or telecom app, never via unverified links.",
      "If someone is asking for urgent help, call them directly on their known phone number to confirm.",
    ];
    avoidActions = [
      "Do not share personal verification codes or passwords.",
      "Do not pay unexpected upfront fees or processing charges.",
    ];
  } else {
    recommendedActions = [
      "No immediate scam patterns were detected in Offline Safety Mode.",
      "Remember to always verify the identity of unknown senders before making payments.",
    ];
    avoidActions = [
      "Never share your Mobile Money PIN with anyone claiming to be customer service.",
    ];
  }

  const explanations = {
    technical: `Analyzed locally on-device by ScamLens Offline Safety Engine (deterministic pattern matching). Detected indicators: ${
      scoreResult.signals.map((s) => s.signal).join(", ") || "none"
    }. Risk score: ${scoreResult.score}/100.`,
    simple:
      scoreResult.level === "HIGH"
        ? "Checked in Offline Safety Mode (no internet data used). This message shows strong scam warning signs such as requesting money, PINs, or urgent action. Do not reply or send money."
        : scoreResult.level === "SUSPICIOUS" || scoreResult.level === "CAUTION"
        ? "Checked in Offline Safety Mode (no internet data used). Some aspects of this message look suspicious. Verify who sent it before you take any action."
        : "Checked in Offline Safety Mode (no internet data used). We didn't find any common scam tricks in this message, but always stay cautious.",
    family:
      scoreResult.level === "HIGH"
        ? "I checked this message on my phone without internet. It looks like a scam trying to trick you. Please do not send any money or give your PIN."
        : "I checked this on my phone without internet. It looks alright, but let's double-check before doing anything with money.",
    voice:
      scoreResult.level === "HIGH"
        ? "Warning! This message looks like a scam. Do not send any money, do not enter your PIN, and do not click any links."
        : "Checked offline. Be careful and never share your Mobile Money PIN with anyone.",
  };

  const rawAnalysis = {
    schemaVersion: 1,
    id: `offline_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    inputType: input.type,
    category,
    riskScore: scoreResult.score,
    riskLevel: scoreResult.level,
    summary:
      scoreResult.level === "HIGH"
        ? "This message contains clear indicators of a scam attempt based on on-device pattern analysis."
        : scoreResult.level === "LOW"
        ? "No known scam patterns detected by the on-device safety scanner."
        : "This message contains elements that require caution before taking action.",
    warningSigns,
    recommendedActions,
    avoidActions,
    explanations,
    confidence: 0.85,
    createdAt: new Date().toISOString(),
    threatIntel: [
      {
        provider: "ScamLens On-Device Offline Engine",
        verdict:
          scoreResult.level === "HIGH"
            ? ("malicious" as const)
            : scoreResult.level === "SUSPICIOUS"
            ? ("suspicious" as const)
            : ("clean" as const),
        threatScore: scoreResult.score,
        details: "Evaluated locally on device without internet connectivity.",
        checkedAt: new Date().toISOString(),
      },
    ],
  };

  return parseScamAnalysis(rawAnalysis);
}
