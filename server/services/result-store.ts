import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { ScamAnalysis } from "../../src/ai/scam-analysis/schema.js";
import type { ThreatEvidence } from "../threat-intel/types.js";

export interface SanitizedPublicResult {
  id: string;
  createdAt: string;
  expiresAt: string;
  riskLevel: "LOW" | "CAUTION" | "SUSPICIOUS" | "HIGH";
  riskScore: number;
  confidence: number;
  category: string;
  summary: string;
  recommendedActions: string[];
  avoidActions: string[];
  warningSigns: Array<{
    type: string;
    explanation: string;
    severity?: "low" | "medium" | "high";
  }>;
  explanations: {
    simple: string;
    technical?: string;
    voice?: string;
  };
  threatIntel?: Array<{
    provider: string;
    verdict: string;
    details?: string;
    checkedAt: string;
    threatScore?: number;
  }>;
  source: "web" | "whatsapp";
}

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;

let resolvedStorageDir: string | null = null;

async function getStorageDir(): Promise<string> {
  if (resolvedStorageDir) {
    return resolvedStorageDir;
  }

  const preferredDir =
    process.env.SCAMLENS_DATA_DIR?.trim() ||
    path.join(process.cwd(), "data", "results");

  try {
    await fs.mkdir(preferredDir, { recursive: true });
    // Test write permission
    const testFile = path.join(preferredDir, `.probe_${Date.now()}`);
    await fs.writeFile(testFile, "probe", "utf8");
    await fs.unlink(testFile);
    resolvedStorageDir = preferredDir;
    return resolvedStorageDir;
  } catch {
    // Fall back to system temporary directory (writable on Vercel and all OSs)
    const fallbackDir = path.join(os.tmpdir(), "scamlens-results");
    await fs.mkdir(fallbackDir, { recursive: true });
    resolvedStorageDir = fallbackDir;
    return resolvedStorageDir;
  }
}

/**
 * Generates an unguessable, cryptographically secure 128-bit random ID.
 * Example: 'an_7dK9_xL2mQ5wR8vP1A'
 */
export function generateResultId(): string {
  const entropy = crypto.randomBytes(14).toString("base64url");
  return `an_${entropy}`;
}

/**
 * Transforms an analysis result into a sanitized, shareable public representation.
 * Explicitly strips all raw user text, phone numbers, PII, and credentials.
 */
export function sanitizeAnalysisForStorage(
  analysis: ScamAnalysis,
  threatIntel?: ThreatEvidence[],
  source: "web" | "whatsapp" = "web",
  ttlMs = DEFAULT_TTL_MS,
): SanitizedPublicResult {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);

  const cleanThreatIntel = threatIntel?.map((t) => ({
    provider: t.provider,
    verdict: t.verdict,
    details: t.details,
    checkedAt: t.checkedAt,
    threatScore: t.threatScore,
  }));

  return {
    id: analysis.id && ID_PATTERN.test(analysis.id) ? analysis.id : generateResultId(),
    createdAt: analysis.createdAt || now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    riskLevel: analysis.riskLevel,
    riskScore: analysis.riskScore,
    confidence: analysis.confidence,
    category: analysis.category,
    summary: analysis.summary,
    recommendedActions: [...analysis.recommendedActions],
    avoidActions: [...analysis.avoidActions],
    warningSigns: analysis.warningSigns.map((w) => ({
      type: w.type,
      explanation: w.explanation,
      severity: w.severity,
    })),
    explanations: {
      simple: analysis.explanations.simple,
      technical: analysis.explanations.technical,
      voice: analysis.explanations.voice,
    },
    threatIntel: cleanThreatIntel && cleanThreatIntel.length > 0 ? cleanThreatIntel : undefined,
    source,
  };
}

/**
 * Persists a sanitized analysis result to disk atomically.
 */
export async function savePublicResult(result: SanitizedPublicResult): Promise<void> {
  if (!ID_PATTERN.test(result.id)) {
    throw new Error(`Invalid result ID format: ${result.id}`);
  }

  const dir = await getStorageDir();
  const filePath = path.join(dir, `${result.id}.json`);
  const tmpPath = path.join(dir, `${result.id}.${Date.now()}.tmp`);

  const payload = JSON.stringify(result, null, 2);
  await fs.writeFile(tmpPath, payload, "utf8");
  await fs.rename(tmpPath, filePath);
}

/**
 * Retrieves a sanitized public result by ID.
 * Returns null if not found or if the result has expired.
 */
export async function getPublicResult(id: string): Promise<SanitizedPublicResult | null> {
  if (!ID_PATTERN.test(id)) {
    return null;
  }

  try {
    const dir = await getStorageDir();
    const filePath = path.join(dir, `${id}.json`);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as SanitizedPublicResult;

    // Check expiration
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      // Result expired; asynchronously remove file
      fs.unlink(filePath).catch(() => {});
      return null;
    }

    return parsed;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Deletes a stored result.
 */
export async function deletePublicResult(id: string): Promise<boolean> {
  if (!ID_PATTERN.test(id)) {
    return false;
  }

  try {
    const dir = await getStorageDir();
    const filePath = path.join(dir, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * Test helper to reset the storage directory pointer.
 */
export function _resetStorageDirForTesting(): void {
  resolvedStorageDir = null;
}
