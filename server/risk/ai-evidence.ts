import type { ScamAnalysis } from "../../src/ai/scam-analysis/schema.js";
import type { RiskSignal } from "./signals.js";

const SIGNAL_ALIASES: Array<{
  signal: RiskSignal;
  patterns: RegExp[];
}> = [
  {
    signal: "credential_request",
    patterns: [
      /credential/i,
      /password/i,
      /passcode/i,
      /pin/i,
      /\botp\b/i,
      /verification code/i,
      /security code/i,
      /login/i,
      /account details/i,
    ],
  },
  {
    signal: "payment_request",
    patterns: [
      /payment/i,
      /money/i,
      /transfer/i,
      /gift card/i,
      /bank transfer/i,
      /pay/i,
    ],
  },
  {
    signal: "urgency",
    patterns: [
      /urgency/i,
      /urgent/i,
      /immediately/i,
      /act now/i,
      /right now/i,
      /deadline/i,
      /today/i,
    ],
  },
  {
    signal: "threat",
    patterns: [
      /threat/i,
      /suspend/i,
      /suspension/i,
      /closed/i,
      /arrest/i,
      /legal action/i,
      /penalty/i,
      /fine/i,
    ],
  },
  {
    signal: "impersonation",
    patterns: [
      /impersonat/i,
      /pretend/i,
      /pretending/i,
      /fake bank/i,
      /fake company/i,
      /trusted organization/i,
      /government/i,
      /bank/i,
      /police/i,
    ],
  },
  {
    signal: "suspicious_link",
    patterns: [
      /link/i,
      /url/i,
      /website/i,
      /click/i,
      /domain/i,
    ],
  },
  {
    signal: "prize_or_reward",
    patterns: [
      /prize/i,
      /reward/i,
      /winner/i,
      /lottery/i,
      /winnings/i,
    ],
  },
  {
    signal: "investment_promise",
    patterns: [
      /investment/i,
      /guaranteed returns/i,
      /guaranteed profit/i,
      /double your money/i,
      /risk-free/i,
    ],
  },
  {
    signal: "too_good_to_be_true",
    patterns: [
      /too good/i,
      /free money/i,
      /easy money/i,
      /get rich/i,
      /guaranteed income/i,
    ],
  },
];

function signalText(analysis: ScamAnalysis): string {
  return [
    analysis.category,
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
    if (alias.patterns.some((pattern) => pattern.test(text))) {
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
  }

  return [...detected.entries()].map(([signal, explanation]) => ({
    signal,
    explanation,
  }));
}
