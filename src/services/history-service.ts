import type { ScamAnalysis } from "@/ai/scam-analysis/schema";

/**
 * History record. By default we store only metadata + the analysis result —
 * never the raw message/screenshot text — to minimize retained sensitive
 * content (see spec #13, #26). Raw content is kept only in-memory for the
 * current session's result screen.
 */
export interface HistoryEntry {
  id: string;
  inputType: ScamAnalysis["inputType"];
  category: ScamAnalysis["category"];
  riskScore: number;
  riskLevel: ScamAnalysis["riskLevel"];
  createdAt: string;
  /** Default retention window; UI can offer to extend for user-requested saves. */
  expiresAt: string;
  label?: string;
}

const STORAGE_KEY = "scamlens.history.v1";
const DEFAULT_RETENTION_DAYS = 30;

function readAll(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage unavailable (private browsing, quota) — fail silently; history
    // is a convenience feature, never a requirement to use ScamLens.
  }
}

export function saveToHistory(analysis: ScamAnalysis, label?: string): HistoryEntry {
  const now = new Date();
  const expires = new Date(now.getTime() + DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const entry: HistoryEntry = {
    id: analysis.id,
    inputType: analysis.inputType,
    category: analysis.category,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    createdAt: analysis.createdAt,
    expiresAt: expires.toISOString(),
    label,
  };
  const all = [entry, ...readAll().filter((e) => e.id !== entry.id)];
  writeAll(all);
  return entry;
}

export function listHistory(): HistoryEntry[] {
  const now = Date.now();
  const all = readAll().filter((e) => new Date(e.expiresAt).getTime() > now);
  // Prune expired entries as a side effect of listing.
  writeAll(all);
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteHistoryEntry(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
}

export function clearHistory(): void {
  writeAll([]);
}
