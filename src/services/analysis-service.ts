import { MockAIProvider } from "@/ai/providers/mock-provider";
import type { AIProvider } from "@/ai/scam-analysis/analyzer";
import type { ScamAnalysis, ScamAnalysisInput } from "@/ai/scam-analysis/schema";

/**
 * Central place the UI calls into for analysis. Hides which AIProvider is
 * active behind one function, so swapping the mock provider for a real
 * server-backed one later is a one-line change here — not a UI change.
 *
 * In Phase 2, this should call a server endpoint (never an AI provider
 * directly from the client) so API keys stay server-side.
 */
let activeProvider: AIProvider = new MockAIProvider();

export function setAnalysisProvider(provider: AIProvider): void {
  activeProvider = provider;
}

export async function runScamAnalysis(input: ScamAnalysisInput): Promise<ScamAnalysis> {
  return activeProvider.analyzeScam(input);
}
