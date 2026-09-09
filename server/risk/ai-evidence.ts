import type { ScamAnalysis } from "../../src/ai/scam-analysis/schema.js";
import type { RiskSignal } from "./signals.js";

const SIGNAL_ALIASES: Array<{
  signal: RiskSignal;
  patterns: RegExp[];
}> = [
  {
    signal: "credential_request",
    patterns: [
      /\b(requests?|asks?|asking|asked|send|share|provide|enter|give)\b.{0,60}\b(password|passcode|pin|otp|verification code|security code|login details|account details)\b/i,
      /\b(password|passcode|pin|otp|verification code|security code)\b.{0,40}\b(send|share|provide|enter|give)\b/i,
      /\b(credential harvesting|credential theft|steal credentials)\b/i,
    ],
  },
  {
    signal: "payment_request",
    patterns: [
      /\b(requests?|asks?|asking|asked|send|pay|transfer|wire)\b.{0,60}\b(money|payment|fee|funds|cash|gift card)\b/i,
      /\b(processing fee|advance fee|upfront fee|transfer fee)\b/i,
      /\b(send|transfer|pay|wire)\b.{0,40}\b(money|funds|cash|payment)\b/i,
    ],
  },
  {
    signal: "urgency",
    patterns: [
      /\b(urgent|urgently|immediately|right now|act now|act immediately)\b/i,
      /\b(last chance|final warning|expires today|today only|within \d+ (minutes?|hours?))\b/i,
      /\b(pressure|pressures|pressuring|time[- ]pressure)\b/i,
    ],
  },
  {
    signal: "threat",
    patterns: [
      /\b(account|service|access).{0,30}\b(suspend|suspended|close|closed|terminate|terminated)\b/i,
      /\b(arrest|legal action|penalty|fine|prosecution|lawsuit)\b/i,
      /\b(threat|threatening|fear tactic|fear appeal)\b/i,
    ],
  },
  {
    signal: "impersonation",
    patterns: [
      /\b(impersonat|pretend|pretending|posing as|fake representative|fake agent)\w*\b/i,
      /\b(claims?|claims to be|pretends to be|posing as)\b.{0,50}\b(bank|police|government|tax office|company|support|customer service)\b/i,
      /\b(fake|fraudulent)\b.{0,30}\b(bank|government|company|support|customer service)\b/i,
    ],
  },
  {
    signal: "suspicious_link",
    patterns: [
      /\b(suspicious|malicious|phishing|fraudulent|unsafe)\b.{0,30}\b(link|url|website|domain)\b/i,
      /\b(link|url|website|domain)\b.{0,30}\b(suspicious|malicious|phishing|fraudulent|unsafe)\b/i,
      /\b(click|open|visit)\b.{0,30}\b(suspicious|unknown|untrusted|malicious)\b.{0,20}\b(link|url|website)\b/i,
    ],
  },
  {
    signal: "prize_or_reward",
    patterns: [
      /\b(unexpected|fake|fraudulent|scam)\b.{0,30}\b(prize|reward|lottery|winnings)\b/i,
      /\b(you('ve| have)? won|winner|prize|lottery|winnings)\b/i,
      /\b(claim|claiming)\b.{0,30}\b(prize|reward|winnings)\b/i,
    ],
  },
  {
    signal: "investment_promise",
    patterns: [
      /\b(guaranteed returns?|guaranteed profit|risk[- ]free investment|double your money)\b/i,
      /\b(investment)\b.{0,50}\b(guaranteed|risk[- ]free|double|certain profit|no risk)\b/i,
      /\b(unrealistic|unusually high|guaranteed)\b.{0,30}\b(returns?|profit|investment)\b/i,
    ],
  },
  {
    signal: "too_good_to_be_true",
    patterns: [
      /\b(free money|easy money|get rich quick|guaranteed income)\b/i,
      /\b(too good to be true|unrealistic offer|unrealistic reward)\b/i,
    ],
  },
];

function signalText(analysis: ScamAnalysis): string {
  return [
    analysis.summary,
    ...analysis.warningSigns.flatMap((warning) => [
      warning.type,
      warning.explanation,
    ]),
  ].join(" ");
}

export function extractAISignals(
  analysis: ScamAnalysis,
): Array<{ signal: RiskSignal; explanation: string }> {
  const text = signalText(analysis);
  const detected = new Map<RiskSignal, string>();

  for (const alias of SIGNAL_ALIASES) {
    const matchedPattern = alias.patterns.find((pattern) =>
      pattern.test(text),
    );

    if (!matchedPattern) {
      continue;
    }

    const warning = analysis.warningSigns.find((item) =>
      alias.patterns.some(
        (pattern) =>
          pattern.test(item.type) ||
          pattern.test(item.explanation),
      ),
    );

    detected.set(
      alias.signal,
      warning?.explanation ??
        `AI analysis identified evidence related to ${alias.signal.replaceAll("_", " ")}.`,
    );
  }

  return [...detected.entries()].map(([signal, explanation]) => ({
    signal,
    explanation,
  }));
}
