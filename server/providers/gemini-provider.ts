import { GoogleGenAI } from "@google/genai";
import type {
  ScamAnalysis,
  ScamAnalysisInput,
} from "../../src/ai/scam-analysis/schema.js";
import { SCAM_CATEGORIES } from "../../src/ai/scam-analysis/schema.js";
import { parseScamAnalysis } from "../../src/ai/scam-analysis/validators.js";
import { AnalysisRequestError } from "../../src/ai/scam-analysis/analyzer.js";
import { SCAMLENS_ANALYZER_V1 } from "../../src/ai/scam-analysis/prompts.js";
import type { ServerAIProvider } from "./ai-provider.js";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const REQUEST_TIMEOUT_MS = 20_000;

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function buildPrompt(input: ScamAnalysisInput): string {
  const content =
    input.type === "url"
      ? `URL to analyze:\n${input.url ?? ""}`
      : `Content to analyze:\n${input.text ?? ""}`;

  return `${SCAMLENS_ANALYZER_V1}

Analyze the following ScamLens input.

Input type: ${input.type}

${content}

STRICT OUTPUT CONTRACT:

Return ONLY one valid JSON object.

Do not return markdown.
Do not use a code block.
Do not add commentary before or after the JSON.

The JSON must contain exactly these top-level fields:

{
  "schemaVersion": 1,
  "id": "string",
  "inputType": "${input.type}",
  "category": "string",
  "riskScore": 0,
  "riskLevel": "LOW",
  "summary": "string",
  "warningSigns": [],
  "recommendedActions": [],
  "avoidActions": [],
  "explanations": {
    "technical": "string",
    "simple": "string",
    "family": "string",
    "voice": "string"
  },
  "confidence": 0,
  "createdAt": "ISO date string"
}

IMPORTANT WARNING SIGN FORMAT:

Every warningSigns item MUST be an object with ALL THREE fields:

{
  "type": "short machine-readable or human-readable warning sign name",
  "severity": "low",
  "explanation": "clear explanation of why this is a warning sign"
}

Example:

"warningSigns": [
  {
    "type": "Urgency",
    "severity": "high",
    "explanation": "The message pressures you to act immediately."
  }
]

If there are no warning signs, return:

"warningSigns": []

Do NOT return warning signs as plain strings.

Do NOT omit "type".
Do NOT use a different field name such as "name", "title", or "signal".

category MUST be exactly one of:
${SCAM_CATEGORIES.map((category) => `"${category}"`).join(", ")}

riskLevel MUST be exactly one of:
"LOW", "CAUTION", "SUSPICIOUS", "HIGH"

warningSigns severity MUST be exactly one of:
"low", "medium", "high"

The category must use the exact machine-readable value.
Do NOT invent category names.
Do NOT use spaces instead of underscores.

Never ask the user for passwords, PINs, OTPs, verification codes, or other secrets.

Return ONLY valid JSON.`;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(
          new AnalysisRequestError(
            "Gemini analysis timed out.",
          ),
        );
      }, timeoutMs);
    }),
  ]);
}

export class GeminiAIProvider implements ServerAIProvider {
  readonly name = "gemini";

  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: getRequiredEnv("AI_API_KEY"),
    });

    this.model =
      process.env.AI_MODEL?.trim() || DEFAULT_MODEL;
  }

  async analyzeScam(
    input: ScamAnalysisInput,
  ): Promise<ScamAnalysis> {
    try {
      const response = await withTimeout(
        this.client.models.generateContent({
          model: this.model,
          contents: buildPrompt(input),
          config: {
            responseMimeType: "application/json",
          },
        }),
        REQUEST_TIMEOUT_MS,
      );

      const text = response.text?.trim();

      if (!text) {
        throw new AnalysisRequestError(
          "Gemini returned an empty response.",
        );
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(text);
      } catch (error) {
        console.error(
          "Gemini raw response:",
          text,
        );

        throw new AnalysisRequestError(
          "Gemini returned invalid JSON.",
          error,
        );
      }

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new AnalysisRequestError(
          "Gemini returned an invalid analysis object.",
        );
      }

      const result = parsed as Record<string, unknown>;

      console.log(
        "Gemini raw schemaVersion:",
        result.schemaVersion,
        "type:",
        typeof result.schemaVersion,
      );

      console.log(
        "Gemini category:",
        result.category,
      );

      console.log(
        "Gemini inputType:",
        result.inputType,
      );

      console.log(
        "Gemini riskScore:",
        result.riskScore,
      );

      console.log(
        "Gemini riskLevel:",
        result.riskLevel,
      );

      if (Array.isArray(result.warningSigns)) {
        console.log(
          "Gemini warningSigns count:",
          result.warningSigns.length,
        );

        console.log(
          "Gemini warningSigns:",
          JSON.stringify(result.warningSigns, null, 2),
        );
      }

      console.log(
        "Gemini raw confidence:",
        result.confidence,
        "type:",
        typeof result.confidence,
      );

      // ScamLens owns these fields.
      result.schemaVersion = 1;

      // The ScamLens schema stores confidence as 0..1.
      // If Gemini returns a percentage such as 95, normalize it.
      if (
        typeof result.confidence === "number" &&
        result.confidence > 1 &&
        result.confidence <= 100
      ) {
        result.confidence = result.confidence / 100;
      }

      result.id = `an_${Math.random()
        .toString(36)
        .slice(2, 10)}${Date.now().toString(36)}`;

      result.inputType = input.type;

      result.createdAt = new Date().toISOString();

      return parseScamAnalysis(result);
    } catch (error) {
      if (error instanceof AnalysisRequestError) {
        throw error;
      }

      console.error(
        "Gemini provider error:",
        error,
      );

      throw new AnalysisRequestError(
        "Gemini analysis failed.",
        error,
      );
    }
  }
}
