import type {
  ScamAnalysis,
  ScamAnalysisInput,
} from "../../src/ai/scam-analysis/schema.js";

export interface ServerAIProvider {
  readonly name: string;

  analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis>;
}
