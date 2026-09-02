import type { AIProvider } from "../scam-analysis/analyzer";
import type { ScamAnalysis, ScamAnalysisInput } from "../scam-analysis/schema";
import { parseScamAnalysis } from "../scam-analysis/validators";
import { MOCK_SCENARIOS, pickScenarioForText } from "./mock-scenarios";

function fakeId(): string {
  return `an_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function simulatedLatencyMs(): number {
  return 900 + Math.floor(Math.random() * 700);
}

/**
 * Mock AI provider. Returns realistic, schema-valid structured data with a
 * simulated delay so the full loading → result UI can be built and tested
 * without a live model. Swappable for a real provider via the AIProvider
 * interface (see analyzer.ts) — no calling code should need to change.
 */
export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  async analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis> {
    await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs()));

    const scenarioKey =
      input.type === "url"
        ? "suspicious_verification"
        : pickScenarioForText(input.text ?? input.url ?? "");

    const scenario = MOCK_SCENARIOS[scenarioKey];

    const raw = {
      ...scenario,
      inputType: input.type,
      id: fakeId(),
      createdAt: new Date().toISOString(),
    };

    // Route through the same validator a real provider's output would go
    // through, so the mock path exercises the exact same safety boundary.
    return parseScamAnalysis(raw);
  }
}
