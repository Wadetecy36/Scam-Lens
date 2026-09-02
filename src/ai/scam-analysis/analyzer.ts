import type { ScamAnalysis, ScamAnalysisInput } from "./schema";

/**
 * Contract every AI provider must implement. UI and services code depend
 * only on this interface, never on a concrete provider — so the mock
 * provider used in Phase 1 can be swapped for a real one later without
 * touching calling code.
 */
export interface AIProvider {
  readonly name: string;
  analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis>;
}

export class AnalysisRequestError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AnalysisRequestError";
  }
}
