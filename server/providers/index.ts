import type { ServerAIProvider } from "./ai-provider.js";
import { GeminiAIProvider } from "./gemini-provider.js";

let provider: ServerAIProvider | undefined;

export function getAIProvider(): ServerAIProvider {
  if (!provider) {
    provider = new GeminiAIProvider();
  }

  return provider;
}
