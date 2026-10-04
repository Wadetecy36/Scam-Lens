import {
  RISK_LEVELS,
  SCAM_CATEGORIES,
  WARNING_SIGN_SEVERITIES,
  type ScamAnalysis,
  type ThreatEvidence,
  type WarningSign,
} from "./schema.js";

export class ScamAnalysisValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScamAnalysisValidationError";
  }
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ScamAnalysisValidationError(message);
}

/**
 * Validates and narrows an unknown value (e.g. parsed JSON from an AI
 * provider) into a ScamAnalysis. Throws ScamAnalysisValidationError on any
 * mismatch — callers must not fall back to rendering unvalidated data.
 */
export function parseScamAnalysis(input: unknown): ScamAnalysis {
  assert(typeof input === "object" && input !== null, "Analysis payload is not an object");
  const obj = input as Record<string, unknown>;


  assert(obj.schemaVersion === 1, "Unsupported or missing schemaVersion");
  assert(isString(obj.id) && obj.id.length > 0, "Missing analysis id");
  assert(isString(obj.inputType), "Missing inputType");
  assert(
    typeof obj.category === "string" && (SCAM_CATEGORIES as readonly string[]).includes(obj.category),
    "Invalid or missing category",
  );
  assert(isFiniteNumber(obj.riskScore) && obj.riskScore >= 0 && obj.riskScore <= 100, "riskScore out of range");
  assert(
    typeof obj.riskLevel === "string" && (RISK_LEVELS as readonly string[]).includes(obj.riskLevel),
    "Invalid or missing riskLevel",
  );
  assert(isString(obj.summary) && obj.summary.length > 0, "Missing summary");
  assert(Array.isArray(obj.warningSigns), "warningSigns must be an array");
  const warningSigns = (obj.warningSigns as unknown[]).map(parseWarningSign);
  assert(Array.isArray(obj.recommendedActions), "recommendedActions must be an array");
  assert(Array.isArray(obj.avoidActions), "avoidActions must be an array");

  assert(typeof obj.explanations === "object" && obj.explanations !== null, "Missing explanations");
  const explanations = obj.explanations as Record<string, unknown>;
  for (const key of ["technical", "simple", "family", "voice"]) {
    assert(isString(explanations[key]) && (explanations[key] as string).length > 0, `Missing explanations.${key}`);
  }

  assert(isFiniteNumber(obj.confidence) && obj.confidence >= 0 && obj.confidence <= 1, "confidence out of range");
  assert(isString(obj.createdAt), "Missing createdAt");

  let threatIntel: ThreatEvidence[] | undefined = undefined;
  if (Array.isArray(obj.threatIntel)) {
    const parsed = (obj.threatIntel as unknown[])
      .map(parseThreatEvidence)
      .filter((t): t is ThreatEvidence => t !== null);
    if (parsed.length > 0) {
      threatIntel = parsed;
    }
  }

  return {
    schemaVersion: 1,
    id: obj.id as string,
    inputType: obj.inputType as ScamAnalysis["inputType"],
    category: obj.category as ScamAnalysis["category"],
    riskScore: obj.riskScore as number,
    riskLevel: obj.riskLevel as ScamAnalysis["riskLevel"],
    summary: obj.summary as string,
    warningSigns,
    recommendedActions: (obj.recommendedActions as unknown[]).filter(isString),
    avoidActions: (obj.avoidActions as unknown[]).filter(isString),
    explanations: {
      technical: explanations.technical as string,
      simple: explanations.simple as string,
      family: explanations.family as string,
      voice: explanations.voice as string,
    },
    confidence: obj.confidence as number,
    createdAt: obj.createdAt as string,
    threatIntel,
  };
}

function parseWarningSign(input: unknown): WarningSign {
  assert(typeof input === "object" && input !== null, "Warning sign is not an object");
  const obj = input as Record<string, unknown>;
  assert(isString(obj.type) && obj.type.length > 0, "Warning sign missing type");
  assert(
    typeof obj.severity === "string" && (WARNING_SIGN_SEVERITIES as readonly string[]).includes(obj.severity),
    "Warning sign has invalid severity",
  );
  assert(isString(obj.explanation) && obj.explanation.length > 0, "Warning sign missing explanation");
  return {
    type: obj.type as string,
    severity: obj.severity as WarningSign["severity"],
    explanation: obj.explanation as string,
  };
}

const VALID_THREAT_VERDICTS = ["malicious", "suspicious", "clean", "unknown"] as const;

function parseThreatEvidence(input: unknown): ThreatEvidence | null {
  if (typeof input !== "object" || input === null) return null;
  const obj = input as Record<string, unknown>;
  if (!isString(obj.provider) || !obj.provider) return null;
  if (typeof obj.verdict !== "string" || !VALID_THREAT_VERDICTS.includes(obj.verdict as typeof VALID_THREAT_VERDICTS[number])) {
    return null;
  }
  const threatScore = typeof obj.threatScore === "number" && Number.isFinite(obj.threatScore) ? obj.threatScore : 0;
  return {
    provider: obj.provider,
    verdict: obj.verdict as ThreatEvidence["verdict"],
    threatScore,
    details: isString(obj.details) ? obj.details : undefined,
    checkedAt: isString(obj.checkedAt) ? obj.checkedAt : new Date().toISOString(),
  };
}

/** Validates a raw URL string without ever fetching it. */
export function isPlausibleUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
