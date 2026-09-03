import { describe, expect, it } from "vitest";
import { riskLevelFromScore, scoreSignals } from "./scorer.js";

describe("riskLevelFromScore", () => {
  it.each([
    [24, "LOW"],
    [25, "CAUTION"],
    [49, "CAUTION"],
    [50, "SUSPICIOUS"],
    [74, "SUSPICIOUS"],
    [75, "HIGH"],
    [100, "HIGH"],
  ] as const)("%s maps to %s", (score, expected) => {
    expect(riskLevelFromScore(score)).toBe(expected);
  });
});

describe("scoreSignals", () => {
  it("assigns the correct weights", () => {
    const result = scoreSignals([
      {
        signal: "urgency",
        explanation: "Act immediately.",
      },
      {
        signal: "payment_request",
        explanation: "Requests payment.",
      },
    ]);

    expect(result.score).toBe(40);
    expect(result.level).toBe("CAUTION");
    expect(result.signals).toHaveLength(2);
    expect(result.signals[0].weight).toBe(15);
    expect(result.signals[1].weight).toBe(25);
  });

  it("caps the score at 100", () => {
    const result = scoreSignals([
      { signal: "urgency", explanation: "Urgent." },
      { signal: "threat", explanation: "Threat." },
      { signal: "credential_request", explanation: "Credentials." },
      { signal: "payment_request", explanation: "Payment." },
      { signal: "suspicious_link", explanation: "Link." },
    ]);

    expect(result.score).toBe(100);
    expect(result.level).toBe("HIGH");
  });
});
