import { describe, expect, it } from "vitest";
import { analyzeSignals } from "./engine.js";

describe("analyzeSignals", () => {
  it("detects urgency", () => {
    const result = analyzeSignals("Act immediately to protect your account.");

    expect(result.signals.map((s) => s.signal)).toContain("urgency");
  });

  it("detects multiple scam signals", () => {
    const result = analyzeSignals(
      "Your bank account will be closed today. Send your OTP immediately: https://example.com",
    );

    const signals = result.signals.map((s) => s.signal);

    expect(signals).toContain("urgency");
    expect(signals).toContain("threat");
    expect(signals).toContain("credential_request");
    expect(signals).toContain("suspicious_link");
    expect(signals).toContain("impersonation");
    expect(result.level).toBe("HIGH");
  });

  it("returns LOW when no known signals are detected", () => {
    const result = analyzeSignals(
      "Here is the recipe we discussed yesterday.",
    );

    expect(result.score).toBe(0);
    expect(result.level).toBe("LOW");
    expect(result.signals).toHaveLength(0);
  });

  it("detects prize and investment language", () => {
    const prize = analyzeSignals("Congratulations, you've won a prize!");
    const investment = analyzeSignals("Guaranteed profit with no risk.");

    expect(prize.signals.map((s) => s.signal)).toContain("prize_or_reward");
    expect(investment.signals.map((s) => s.signal)).toContain(
      "investment_promise",
    );
  });
});
