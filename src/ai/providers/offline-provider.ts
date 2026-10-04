import type { AIProvider } from "../scam-analysis/analyzer.js";
import type { ScamAnalysis, ScamAnalysisInput } from "../scam-analysis/schema.js";
import { analyzeOfflineScam } from "@/risk/offline-analyzer";

export class OfflineRiskProvider implements AIProvider {
  readonly name = "offline-engine";

  async analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis> {
    return analyzeOfflineScam(input);
  }
}
