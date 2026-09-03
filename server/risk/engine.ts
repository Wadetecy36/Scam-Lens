import { scoreSignals } from "./scorer.js";
import type { RiskSignal } from "./signals.js";

interface SignalRule {
  signal: RiskSignal;
  explanation: string;
  patterns: RegExp[];
}

const RULES: SignalRule[] = [
  {
    signal: "urgency",
    explanation: "The message pressures you to act immediately.",
    patterns: [
      /\b(urgent|immediately|right now|act now|today only|last chance)\b/i,
    ],
  },
  {
    signal: "threat",
    explanation: "The message uses a threat or fear to pressure you.",
    patterns: [
      /\b(account will be closed|account suspended|legal action|arrest|penalty|fine)\b/i,
    ],
  },
  {
    signal: "credential_request",
    explanation: "The message appears to ask for sensitive account information.",
    patterns: [
      /\b(password|passcode|pin|otp|verification code|security code)\b/i,
    ],
  },
  {
    signal: "payment_request",
    explanation: "The message asks for money or payment.",
    patterns: [
      /\b(send money|make a payment|pay now|transfer money|wire transfer|gift card)\b/i,
    ],
  },
  {
    signal: "suspicious_link",
    explanation: "The message contains a link that should be checked carefully.",
    patterns: [
      /\bhttps?:\/\/\S+/i,
      /\bwww\.\S+/i,
    ],
  },
  {
    signal: "impersonation",
    explanation: "The message may be pretending to come from a trusted organization or person.",
    patterns: [
      /\b(bank|police|government|tax office|microsoft|apple|google|amazon|paypal)\b/i,
    ],
  },
  {
    signal: "prize_or_reward",
    explanation: "The message mentions an unexpected prize, reward, or winnings.",
    patterns: [
      /\b(you('ve| have)? won|winner|prize|reward|lottery|winnings)\b/i,
    ],
  },
  {
    signal: "investment_promise",
    explanation: "The message promises unusually attractive investment returns.",
    patterns: [
      /\b(guaranteed returns|guaranteed profit|double your money|risk[- ]free investment)\b/i,
    ],
  },
  {
    signal: "too_good_to_be_true",
    explanation: "The offer makes an unusually attractive promise.",
    patterns: [
      /\b(free money|easy money|get rich quick|guaranteed income)\b/i,
    ],
  },
];

export function analyzeSignals(content: string) {
  const signals = RULES
    .filter((rule) =>
      rule.patterns.some((pattern) => pattern.test(content)),
    )
    .map(({ signal, explanation }) => ({
      signal,
      explanation,
    }));

  return scoreSignals(signals);
}
