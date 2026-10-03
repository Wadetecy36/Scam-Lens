import type { ServerAIProvider } from "./ai-provider.js";
import { GeminiAIProvider } from "./gemini-provider.js";
import { ServerMockAIProvider } from "./mock-provider.js";

let provider: ServerAIProvider | undefined;

export function setAIProvider(newProvider: ServerAIProvider | undefined): void {
  provider = newProvider;
}

export function getAIProvider(): ServerAIProvider {
  if (!provider) {
    if (process.env.AI_API_KEY && process.env.NODE_ENV !== "test") {
      try {
        provider = new GeminiAIProvider();
      } catch {
        provider = new ServerMockAIProvider();
      }
    } else {
      provider = new ServerMockAIProvider();
    }
  }

  return provider;
}
