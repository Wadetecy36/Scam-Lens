import { getAIProvider } from "../providers/index.js";
import { analyzeCombinedRisk } from "../risk/engine.js";
import { redactPII } from "../privacy/pii-redactor.js";
import { aggregateThreatIntel } from "../threat-intel/aggregator.js";
import { ValidationError } from "../validation/analyze.js";
import type {
  ScamAnalysis,
  ScamAnalysisInput,
} from "../../src/ai/scam-analysis/schema.js";
import type { ThreatEvidence } from "../threat-intel/types.js";

const INJECTION_PATTERNS = [
  /ignore.*?instructions/i,
  /forget.*?instructions/i,
  /ignore.*?rules/i,
  /ignore.*?directions/i,
  /system prompt/i,
  /bypass rules/i,
  /you are now a/i,
  /print.*?instructions/i,
  /print.*?prompt/i,
];

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
  // PRE-FLIGHT: Prompt Injection & Jailbreak Defense
  if (INJECTION_PATTERNS.some((pattern) => pattern.test(content))) {
    throw new ValidationError(
      "Input rejected: Potential prompt injection or jailbreak attempt detected.",
    );
  }

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

  const [aiAnalysis, threatIntel] = await Promise.all([
    provider.analyzeScam(aiInput),
    threatIntelPromise,
  ]);

  const isMaliciousUrl = threatIntel.some((t) => t.verdict === "malicious");
  const isSuspiciousUrl = threatIntel.some((t) => t.verdict === "suspicious");

  /*
   * ScamLens owns the final risk decision:
   * Gemini provides semantic evidence;
   * The deterministic risk engine calculates the final score and risk level.
   */
  let risk = analyzeCombinedRisk(content, aiAnalysis);
  const warningSigns = [...aiAnalysis.warningSigns];

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
