export const INPUT_TYPES = [
  "message",
  "screenshot",
  "url",
  "call",
] as const;

export type AnalyzeInputType = (typeof INPUT_TYPES)[number];

export interface AnalyzeRequest {
  type: AnalyzeInputType;
  content: string;
}

const MAX_CONTENT_LENGTH = 20_000;

export function parseAnalyzeRequest(
  body: unknown,
): AnalyzeRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object.");
  }

  const input = body as Record<string, unknown>;

  if (
    typeof input.type !== "string" ||
    !INPUT_TYPES.includes(input.type as AnalyzeInputType)
  ) {
    throw new Error(
      "type must be one of: message, screenshot, url, call.",
    );
  }

  if (
    typeof input.content !== "string" ||
    input.content.trim().length === 0
  ) {
    throw new Error("content must be a non-empty string.");
  }

  if (input.content.length > MAX_CONTENT_LENGTH) {
    throw new Error(
      `content must not exceed ${MAX_CONTENT_LENGTH} characters.`,
    );
  }

  return {
    type: input.type as AnalyzeInputType,
    content: input.content.trim(),
  };
}
