import { getAIProvider } from "../providers/index.js";
import { analyzeCombinedRisk } from "../risk/engine.js";
import { analyzeOfflineScam } from "../../src/risk/offline-analyzer.js";
import { redactPII } from "../privacy/pii-redactor.js";
import { aggregateThreatIntel } from "../threat-intel/aggregator.js";
import type {
  ScamAnalysis,
  ScamAnalysisInput,
} from "../../src/ai/scam-analysis/schema.js";
import type { ThreatEvidence } from "../threat-intel/types.js";

function toAIInput(
  type: "message" | "url" | "call" | "screenshot",
  content: string,
): ScamAnalysisInput {
  switch (type) {
    case "message":
      return { type: "message", text: content };
    case "screenshot":
      return { type: "image", text: content };
    case "url":
      return { type: "url", url: content };
    case "call":
      return { type: "call", text: content };
  }
}

export interface PipelineResult {
  analysis: ScamAnalysis;
  threatIntel: ThreatEvidence[];
  redactions: Record<string, number>;
}

export async function executeAnalysisPipeline(
  content: string,
  type: "message" | "url" | "call" | "screenshot" = "message",
): Promise<PipelineResult> {
  const provider = getAIProvider();

  // PRIVACY: scrub personal data before it leaves our server
  const redaction =
    type === "url"
      ? { text: content, counts: {} }
      : redactPII(content);
  const aiInput = toAIInput(type, redaction.text);

  const redactedTotal = Object.values(redaction.counts).reduce(
    (a, b) => a + (b ?? 0),
    0,
  );
  if (redactedTotal > 0) {
    console.log("[privacy] redacted before AI call:", redaction.counts);
  }

  // THREAT INTEL: Query live security feeds in parallel if URL is analyzed or present
  const urlMatch =
    type === "url"
      ? content
      : content.match(/https?:\/\/[^\s"'<>]+/i)?.[0];
  const threatIntelPromise = urlMatch
    ? aggregateThreatIntel(urlMatch)
    : Promise.resolve([]);

  // Resilient AI Provider call: if AI provider times out, fails, or throws,
  // gracefully fall back to deterministic offline analyzer so user is never denied safety advice.
  const aiAnalysisPromise = provider.analyzeScam(aiInput).catch((aiError) => {
    console.warn(
      "[pipeline] AI provider failed or timed out. Falling back to deterministic offline analyzer:",
      aiError,
    );
    return analyzeOfflineScam(aiInput);
  });

  const [aiAnalysis, threatIntel] = await Promise.all([
    aiAnalysisPromise,
    threatIntelPromise,
  ]);

  const isMaliciousUrl = threatIntel.some((t) => t.verdict === "malicious");
  const isSuspiciousUrl = threatIntel.some((t) => t.verdict === "suspicious");

  /*
   * ScamLens owns the final risk decision:
   * Deterministic hard tripwires and threat intelligence take safety precedence;
   * Strong AI evidence cannot be demoted.
   */
  let risk = analyzeCombinedRisk(content, aiAnalysis);
  const warningSigns = [...aiAnalysis.warningSigns];

  // Merge any deterministic signals that are not already present in warningSigns
  for (const sig of risk.signals) {
    const alreadyPresent = warningSigns.some(
      (w) =>
        w.type.toLowerCase() === sig.signal.toLowerCase() ||
        w.explanation.toLowerCase().includes(sig.signal.toLowerCase()),
    );
    if (!alreadyPresent) {
      warningSigns.push({
        type: sig.signal,
        severity: sig.weight >= 25 ? "high" : "medium",
        explanation: sig.explanation,
      });
    }
  }

  if (isMaliciousUrl) {
    const maliciousFinding = threatIntel.find((t) => t.verdict === "malicious");
    risk = {
      ...risk,
      score: Math.max(risk.score, 95),
      level: "HIGH" as const,
    };
    warningSigns.unshift({
      type: "Known Malicious URL",
      severity: "high" as const,
      explanation:
        maliciousFinding?.details ||
        "This link matches an active threat in global cybersecurity malware databases.",
    });
  } else if (isSuspiciousUrl) {
    const suspiciousFinding = threatIntel.find((t) => t.verdict === "suspicious");
    risk = {
      ...risk,
      score: Math.max(risk.score, 50),
      level: risk.level === "LOW" ? ("CAUTION" as const) : risk.level,
    };
    warningSigns.push({
      type: "Suspicious or Obfuscated Link",
      severity: "medium" as const,
      explanation:
        suspiciousFinding?.details ||
        "This link uses shortening or redirection techniques commonly used to hide scam destinations.",
    });
  }

  const analysis: ScamAnalysis = {
    ...aiAnalysis,
    riskScore: risk.score,
    riskLevel: risk.level,
    warningSigns,
    threatIntel: threatIntel.length > 0 ? threatIntel : undefined,
  };

  return {
    analysis,
    threatIntel,
    redactions: redaction.counts,
  };
}
