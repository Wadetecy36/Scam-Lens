import { describe, expect, it } from "vitest";
import { isPlausibleUrl, parseScamAnalysis, ScamAnalysisValidationError } from "@/ai/scam-analysis/validators";
import { riskLevelFromScore } from "@/ai/scam-analysis/schema";

describe("riskLevelFromScore", () => {
  it("uses the documented boundaries", () => {
    expect(riskLevelFromScore(24)).toBe("LOW");
    expect(riskLevelFromScore(25)).toBe("CAUTION");
    expect(riskLevelFromScore(49)).toBe("CAUTION");
    expect(riskLevelFromScore(50)).toBe("SUSPICIOUS");
    expect(riskLevelFromScore(74)).toBe("SUSPICIOUS");
    expect(riskLevelFromScore(75)).toBe("HIGH");
  });
});

describe("isPlausibleUrl", () => {
  it("accepts http and https URLs without fetching them", () => {
    expect(isPlausibleUrl("https://example.com/path?q=1")).toBe(true);
    expect(isPlausibleUrl("http://example.com")).toBe(true);
  });
  it("rejects non-web protocols and malformed values", () => {
    expect(isPlausibleUrl("javascript:alert(1)")).toBe(false);
    expect(isPlausibleUrl("not a url")).toBe(false);
  });
});

describe("parseScamAnalysis", () => {
  const valid = {
    schemaVersion: 1,
    id: "an_test",
    inputType: "message",
    category: "phishing",
    riskScore: 82,
    riskLevel: "HIGH",
    summary: "This message has several warning signs.",
    warningSigns: [{ type: "urgency", severity: "high", explanation: "It pressures you to act now." }],
    recommendedActions: ["Do not click the link."],
    avoidActions: ["Do not share your password."],
    explanations: { technical: "Technical.", simple: "Simple.", family: "Family.", voice: "Voice." },
    confidence: 0.9,
    createdAt: new Date().toISOString(),
  };

  it("accepts a valid structured result", () => {
    expect(parseScamAnalysis(valid).riskLevel).toBe("HIGH");
  });

  it("rejects missing or invalid fields", () => {
    expect(() => parseScamAnalysis({ ...valid, riskScore: 101 })).toThrow(ScamAnalysisValidationError);
    expect(() => parseScamAnalysis({ ...valid, explanations: {} })).toThrow(ScamAnalysisValidationError);
  });
});
