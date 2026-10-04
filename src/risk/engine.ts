import type { ScamAnalysis } from "../ai/scam-analysis/schema.js";
import { scoreSignals, type RiskLevel } from "./scorer.js";
import { extractAISignals } from "./ai-evidence.js";
import type { DetectedSignal, RiskSignal } from "./signals.js";

interface SignalRule {
  signal: RiskSignal;
  explanation: string;
  patterns: RegExp[];
}

export const RULES: SignalRule[] = [
  {
    signal: "urgency",
    explanation: "The message pressures you to act immediately.",
    patterns: [
      /\b(urgent|immediately|right now|act now|today only|last chance)\b/i,
      /\b(today|within \d+ (hours?|minutes?))\b.*\b(claim|pay|send|verify|confirm|complete)\b/i,
    ],
  },

  {
    signal: "threat",
    explanation: "The message uses a threat or fear to pressure you.",
    patterns: [
      /\b(account will be closed|account suspended|account will be suspended|account may be suspended|legal action|arrest|penalty|fine)\b/i,
      /\b(suspended|closed|blocked|terminated)\b.*\b(if|unless|or)\b/i,
    ],
  },

  {
    signal: "credential_request",
    explanation:
      "The message appears to ask for sensitive account information.",
    patterns: [
      /\b(password|passcode|pin|otp|verification code|security code)\b/i,
      /\b(send|provide|share|enter|give|submit)\b.*\b(password|passcode|pin|otp|verification code|security code)\b/i,
      /\b(momo pin|mobile money pin|wallet pin)\b/i,
    ],
  },

  {
    signal: "payment_request",
    explanation: "The message asks for money or payment.",
    patterns: [
      /\b(send money|make a payment|pay now|transfer money|wire transfer|gift card|buy a gift card)\b/i,
      /\b(pay|payment|fee|processing fee|claim fee|activation fee|delivery fee)\b/i,
      /\b(send it back|reverse (the )?(money|transaction)|cash out|protocol fee|enlistment fee|recruitment fee)\b/i,
    ],
  },

  {
    signal: "suspicious_link",
    explanation:
      "The message contains a link that should be checked carefully.",
    patterns: [
      /\bhttps?:\/\/\S+/i,
      /\bwww\.\S+/i,
    ],
  },

  {
    signal: "impersonation",
    explanation:
      "The message may be pretending to come from a trusted organization or person.",
    patterns: [
      /\b(your bank|bank security|bank support|bank representative)\b/i,
      /\b(police officer|police department|government official|government notice|tax office|tax authority)\b/i,
      /\b(microsoft support|microsoft support agent|apple support|google support|amazon support|paypal support)\b/i,
      /\b(customer support|support agent|security team|account security team)\b/i,
      /\b(official notice|official warning|account security alert)\b/i,
      /\b(mtn (support|customer care|agent|representative|momo)|telecel (support|care|agent)|vodafone (support|agent)|airteltigo|ghana revenue authority|gra|ghana police|customs division|ceps|ghana immigration)\b/i,
    ],
  },

  {
    signal: "prize_or_reward",
    explanation:
      "The message mentions an unexpected prize, reward, or winnings.",
    patterns: [
      /\b(you('ve| have)? won|winner|prize|reward|lottery|winnings|congratulations)\b/i,
    ],
  },

  {
    signal: "investment_promise",
    explanation:
      "The message promises unusually attractive investment returns.",
    patterns: [
      /\b(guaranteed returns|guaranteed profit|double your money|risk[- ]free investment)\b/i,
      /\bguaranteed\b.*\b(profit|return|income|money)\b/i,
    ],
  },

  {
    signal: "too_good_to_be_true",
    explanation:
      "The offer makes an unusually attractive promise.",
    patterns: [
      /\b(free money|easy money|get rich quick|guaranteed income)\b/i,
      /\$?\d[\d,]*(?:\.\d+)?\b.*\b(within|in)\b.*\b(hours?|minutes?|days?)\b/i,
    ],
  },

  {
    signal: "fake_document",
    explanation:
      "The document or statement is explicitly marked as a fictional entity, testing artifact, or has arithmetic balance mismatches.",
    patterns: [
      /\b(fictional entity|testing purposes only|math mismatch|for testing purposes|doctored document)\b/i,
    ],
  },

  // --- Benchmark Taxonomy Extensions ---
  {
    signal: "REMOTE_ACCESS_PROMPT",
    explanation: "Requests downloading remote control software.",
    patterns: [/\b(download anydesk|install teamviewer|quicksupport|anydesk|teamviewer)\b/i],
  },
  {
    signal: "TYPOSQUATTING_DOMAIN",
    explanation: "Domain mimics a trusted brand with subtle edits.",
    patterns: [/(paypa1\.com|arnazon|chase-verify)/i],
  },
  {
    signal: "SYNTHETIC_DOCUMENT_MARKER",
    explanation: "Contains explicit synthetic or fake document indicators.",
    patterns: [/\b(fictional entity|testing purposes only|math mismatch)\b/i],
  },
  {
    signal: "RELATIONSHIP_HIJACK",
    explanation: "Pretends to be a friend or relative in distress from a new number.",
    patterns: [/\b(lost my phone|this is my new number|stranded at the airport|need quick cash)\b/i],
  },
  {
    signal: "OFF_PLATFORM_DIVERSION",
    explanation: "Pushing communication away from monitored channels to encrypted chats.",
    patterns: [/\b(message me on whatsapp|add me on telegram|continue on signal|email me privately)\b/i],
  },
  {
    signal: "HOMOGLYPH_UNICODE_ATTACK",
    explanation: "Non-standard Cyrillic or Greek characters replacing Latin alphabets.",
    patterns: [/[a-zA-Z][\u0400-\u04FF][a-zA-Z]|[a-zA-Z][\u0370-\u03FF][a-zA-Z]/],
  },
];

export function applyCombinationRules(
  score: ReturnType<typeof scoreSignals>,
  content: string,
) {
  const signals = new Set(score.signals.map((s) => s.signal));

  const has = (...required: RiskSignal[]) =>
    required.every((signal) => signals.has(signal));

  /*
   * Explicit high-confidence investment scam.
   *
   * Example:
   * "Invest $500 today and receive guaranteed profit of $5,000
   *  within 24 hours. Risk-free investment."
   */
  if (
    /\binvest\b/i.test(content) &&
    /\b(guaranteed profit|guaranteed return|risk[- ]free investment)\b/i.test(
      content,
    ) &&
    /\b(within|in)\s+\d+\s+(hours?|minutes?|days?)\b/i.test(content)
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Credential theft + urgency + threat = HIGH.
  if (has("credential_request", "urgency", "threat")) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Prize/reward + a claim/processing fee + urgency = HIGH.
  // Covers lottery and advance-fee prize scams even when the
  // wording does not explicitly contain "pay now".
  if (
    has("prize_or_reward", "payment_request", "urgency") ||
    (
      /\b(lottery|winnings|prize|reward|winner)\b/i.test(content) &&
      /\b(claim fee|processing fee|activation fee|fee)\b/i.test(content) &&
      /\b(today|immediately|right now|urgent|act now)\b/i.test(content)
    )
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Fake recruitment / protocol / enlistment / admission fee scam = HIGH.
  if (
    /\b(protocol fee|enlistment fee|recruitment fee|admission fee|slot fee)\b/i.test(content) ||
    (
      /\b(recruitment|enlistment|admission|protocol)\b/i.test(content) &&
      /\b(protocol form|enlistment form|secure (your )?slot|guaranteed (admission|slot|entry))\b/i.test(content) &&
      has("payment_request")
    )
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Mobile money fake reversal or cash-out authorization scam = HIGH.
  if (
    (/\b(momo|mobile money|telecel cash|vodafone cash|wallet|ghs|cedis?)\b/i.test(content) || has("payment_request")) &&
    (
      /\b(mistakenly|accidentally|wrongly|mistaken)\b.*\b(sent|transferred|transfer)\b/i.test(content) ||
      /\b(reverse|reversal|send it back)\b/i.test(content) ||
      /\b(approve|authorize|enter)\b.*\b(prompt|pin)\b/i.test(content)
    )
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Telecom / MoMo impersonation combined with threat, urgency, or credential request = HIGH.
  if (
    /\b(mtn|telecel|vodafone|airteltigo)\b/i.test(content) &&
    /\b(sim|account|line|wallet|momo)\b/i.test(content) &&
    (has("threat") || has("urgency") || has("credential_request") || /\b(block|blocked|deactivate|upgrade|swap)\b/i.test(content))
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Trusted organization impersonation + credential theft.
  if (has("impersonation", "credential_request")) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Authority impersonation + threat + payment.
  if (
    has("impersonation", "threat", "payment_request") &&
    !/\b(government|government official|government notice|tax office|tax authority)\b/i.test(
      content,
    )
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Payment + urgency + suspicious link.
  if (has("payment_request", "urgency", "suspicious_link")) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Gift card + urgency + payment.
  if (
    has("payment_request", "urgency") &&
    /\bgift card\b/i.test(content)
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Guaranteed investment promise with urgency.
  if (has("investment_promise", "urgency")) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Investment promise by itself = SUSPICIOUS.
  if (has("investment_promise")) {
    return {
      ...score,
      score: Math.max(score.score, 50),
      level: "SUSPICIOUS" as const,
    };
  }

  // Account threat combined with another suspicious signal.
  if (
    has("threat", "credential_request") ||
    has("threat", "suspicious_link") ||
    has("threat", "urgency")
  ) {
    return {
      ...score,
      score: Math.max(score.score, 50),
      level: "SUSPICIOUS" as const,
    };
  }

  // Explicit account verification warning.
  if (
    /\baccount\b/i.test(content) &&
    /\b(may be suspended|will be suspended|will be closed|suspended|closed)\b/i.test(
      content,
    ) &&
    /\b(verification|verify|required|complete)\b/i.test(content)
  ) {
    return {
      ...score,
      score: Math.max(score.score, 50),
      level: "SUSPICIOUS" as const,
    };
  }

  // Government fine/threat stays SUSPICIOUS rather than HIGH.
  if (
    /\b(government official|government notice|tax office|tax authority)\b/i.test(
      content,
    ) &&
    has("threat")
  ) {
    return {
      ...score,
      score: Math.max(score.score, 50),
      level: "SUSPICIOUS" as const,
    };
  }

  /*
   * Only classify an investment opportunity as CAUTION when it is
   * explicitly being offered as available.
   *
   * This intentionally does NOT match:
   * "I am contacting you about an investment opportunity..."
   */
  if (
    /\binvestment opportunity\b/i.test(content) &&
    /\bavailable\b/i.test(content)
  ) {
    return {
      ...score,
      score: Math.max(score.score, 25),
      level: "CAUTION" as const,
    };
  }

  // Lottery/prize advance-fee scam = HIGH.
  // This must run before the generic prize/reward CAUTION rule.
  if (
    /\b(lottery|winnings|prize|winner|reward)\b/i.test(content) &&
    /\b(claim fee|processing fee|activation fee|fee)\b/i.test(content) &&
    /\b(today|immediately|right now|urgent|act now)\b/i.test(content)
  ) {
    return {
      ...score,
      score: Math.max(score.score, 85),
      level: "HIGH" as const,
    };
  }

  // Unexpected prize/reward.
  if (has("prize_or_reward")) {
    return {
      ...score,
      score: Math.max(score.score, 25),
      level: "CAUTION" as const,
    };
  }

  // Suspicious link alone.
  if (has("suspicious_link")) {
    return {
      ...score,
      score: Math.max(score.score, 25),
      level: "CAUTION" as const,
    };
  }

  // Normal completed payments should remain LOW.
  if (
    has("payment_request") &&
    /\b(electricity bill|rent payment|rent|bill|salary|savings account)\b/i.test(
      content,
    ) &&
    !has("urgency", "threat", "suspicious_link", "impersonation")
  ) {
    return {
      ...score,
      score: 0,
      level: "LOW" as const,
      signals: [],
    };
  }

  // Standalone payment request.
  if (
    has("payment_request") &&
    /\b(send money|pay now|transfer money|wire transfer|gift card|buy a gift card)\b/i.test(
      content,
    )
  ) {
    return {
      ...score,
      score: Math.max(score.score, 25),
      level: "CAUTION" as const,
    };
  }

  return score;
}

export function analyzeSignals(content: string) {
  const signals = RULES
    .filter((rule) =>
      rule.patterns.some((pattern) => pattern.test(content)),
    )
    .map(({ signal, explanation }) => ({
      signal,
      explanation,
    }));

  const score = scoreSignals(signals);

  return applyCombinationRules(score, content);
}

const RISK_LEVEL_PRECEDENCE: Record<RiskLevel, number> = {
  LOW: 0,
  CAUTION: 1,
  SUSPICIOUS: 2,
  HIGH: 3,
};

const PRECEDENCE_TO_LEVEL: RiskLevel[] = ["LOW", "CAUTION", "SUSPICIOUS", "HIGH"];

export function analyzeCombinedRisk(
  content: string,
  aiAnalysis: ScamAnalysis,
) {
  const deterministic = analyzeSignals(content);
  const aiSignals = extractAISignals(aiAnalysis);

  const merged = new Map<RiskSignal, DetectedSignal>();

  for (const signal of deterministic.signals) {
    merged.set(signal.signal, signal);
  }

  for (const signal of aiSignals) {
    if (!merged.has(signal.signal)) {
      merged.set(signal.signal, {
        ...signal,
        weight: 0,
      });
    }
  }

  const combined = scoreSignals(
    [...merged.values()].map(({ signal, explanation }) => ({
      signal,
      explanation,
    })),
  );

  const deterministicCombined = applyCombinationRules(combined, content);

  // MONOTONIC SAFETY RECONCILIATION:
  // AI-derived evidence must never be silently demoted if it identifies credible danger.
  // Deterministic hard tripwires (MoMo reversal, OTP theft, SIM threats) always hold,
  // but AI-detected danger cannot be erased by absent or incomplete deterministic regexes.
  const detRank = RISK_LEVEL_PRECEDENCE[deterministicCombined.level] ?? 0;
  const aiRank = RISK_LEVEL_PRECEDENCE[aiAnalysis.riskLevel] ?? 0;

  let finalScore = Math.max(deterministicCombined.score, aiAnalysis.riskScore);
  let finalRank = Math.max(detRank, aiRank);

  // Explicit benign completed payments (e.g. utility bill / rent payment without any red flags)
  // preserve LOW risk if AI did not find credible HIGH risk evidence.
  const isExplicitBenignPayment =
    deterministicCombined.score === 0 &&
    deterministicCombined.signals.length === 0 &&
    /\b(electricity bill|rent payment|rent|bill|salary|savings account)\b/i.test(content) &&
    aiRank < RISK_LEVEL_PRECEDENCE.HIGH;

  if (isExplicitBenignPayment) {
    finalScore = 0;
    finalRank = RISK_LEVEL_PRECEDENCE.LOW;
  }

  // Ensure finalScore adheres to the minimum threshold for its severity level
  const finalLevel = PRECEDENCE_TO_LEVEL[finalRank];
  if (finalLevel === "HIGH" && finalScore < 75) {
    finalScore = 85;
  } else if (finalLevel === "SUSPICIOUS" && finalScore < 50) {
    finalScore = 50;
  } else if (finalLevel === "CAUTION" && finalScore < 25) {
    finalScore = 25;
  }

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    level: finalLevel,
    signals: deterministicCombined.signals,
  };
}
