import { MockAIProvider } from "@/ai/providers/mock-provider";
import { OfflineRiskProvider } from "@/ai/providers/offline-provider";
import type { AIProvider } from "@/ai/scam-analysis/analyzer";
import { AnalysisRequestError } from "@/ai/scam-analysis/analyzer";
import type { ScamAnalysis, ScamAnalysisInput } from "@/ai/scam-analysis/schema";
import { parseScamAnalysis } from "@/ai/scam-analysis/validators";
import { env } from "@/config/env";

export class ServerBackedAIProvider implements AIProvider {
  readonly name = "server";
  private readonly baseUrl: string;
  private readonly fallbackProvider: AIProvider;
  private readonly offlineProvider: AIProvider;

  constructor(
    baseUrl: string = env.apiUrl,
    fallbackProvider: AIProvider = new MockAIProvider(),
    offlineProvider: AIProvider = new OfflineRiskProvider(),
  ) {
    this.baseUrl = baseUrl;
    this.fallbackProvider = fallbackProvider;
    this.offlineProvider = offlineProvider;
  }

  async analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis> {
    const isClientOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (isClientOffline) {
      console.info("[ScamLens] Network offline. Using on-device offline safety engine.");
      return this.offlineProvider.analyzeScam(input);
    }

    const content =
      input.type === "url" ? input.url ?? "" : input.text ?? "";
    const type = input.type === "image" ? "screenshot" : input.type;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        let serverErrorMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            serverErrorMsg = errData.error.message;
          }
        } catch (_) {
          // ignore json parse errors
        }
        throw new Error(serverErrorMsg);
      }

      const json = (await response.json()) as {
        ok?: boolean;
        analysis?: unknown;
      };

      if (!json?.ok || !json?.analysis) {
        throw new Error("Invalid response structure from ScamLens server.");
      }

      return parseScamAnalysis(json.analysis);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      
      // If the backend specifically rejected the input (e.g., prompt injection, rate limit), surface it immediately
      if (msg.includes("Input rejected") || msg.includes("Too Many Requests")) {
        throw new AnalysisRequestError(msg, err);
      }

      // If network is down, failed to fetch, or timed out, gracefully use on-device offline analysis
      const isNetworkIssue =
        (typeof navigator !== "undefined" && !navigator.onLine) ||
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("fetch failed") ||
        msg.includes("aborted") ||
        msg.includes("abort");

      if (isNetworkIssue) {
        console.warn("[ScamLens] Network unreachable. Falling back to on-device offline engine:", err);
        return this.offlineProvider.analyzeScam(input);
      }

      if (env.useMockAnalysis) {
        console.warn(
          "ScamLens API unavailable, falling back to local simulation provider:",
          err,
        );
        return this.fallbackProvider.analyzeScam(input);
      }
      throw new AnalysisRequestError(
        msg || "ScamLens analysis service is currently unavailable. Please try again shortly.",
        err,
      );
    }
  }
}

let activeProvider: AIProvider = env.useMockAnalysis
  ? new MockAIProvider()
  : new ServerBackedAIProvider();

export function setAnalysisProvider(provider: AIProvider): void {
  activeProvider = provider;
}

export async function runScamAnalysis(
  input: ScamAnalysisInput,
): Promise<ScamAnalysis> {
  return activeProvider.analyzeScam(input);
}
