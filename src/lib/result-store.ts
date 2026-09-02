import type { ScamAnalysis } from "@/ai/scam-analysis/schema";

/**
 * Session-only store for full analysis results (including any raw input
 * text kept alongside them). Deliberately not persisted to localStorage —
 * only lightweight metadata goes to history-service. A page refresh
 * clearing this is the intended behavior, not a bug.
 */
const results = new Map<string, { analysis: ScamAnalysis; rawInput?: string }>();

export function storeResult(analysis: ScamAnalysis, rawInput?: string): void {
  results.set(analysis.id, { analysis, rawInput });
}

export function getResult(id: string) {
  return results.get(id);
}
