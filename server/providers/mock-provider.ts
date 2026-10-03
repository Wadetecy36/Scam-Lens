import type { ServerAIProvider } from "./ai-provider.js";
import type {
  ScamAnalysis,
  ScamAnalysisInput,
} from "../../src/ai/scam-analysis/schema.js";
import { parseScamAnalysis } from "../../src/ai/scam-analysis/validators.js";
import {
  MOCK_SCENARIOS,
  pickScenarioForText,
} from "../../src/ai/providers/mock-scenarios.js";

export class ServerMockAIProvider implements ServerAIProvider {
  readonly name = "mock";

  async analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis> {
    const text = input.text ?? input.url ?? "";
    const scenarioKey =
      input.type === "url"
        ? "suspicious_verification"
        : pickScenarioForText(text);

    const scenario = MOCK_SCENARIOS[scenarioKey];
    const raw = {
      ...scenario,
      inputType: input.type,
      id: `an_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    return parseScamAnalysis(raw);
  }
}
