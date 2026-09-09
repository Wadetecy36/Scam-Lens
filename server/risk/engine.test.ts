import { describe, expect, it } from "vitest";
import { analyzeSignals } from "./engine.js";

describe("ScamLens Risk Engine", () => {
  describe("signal detection", () => {
    it("detects urgency", () => {
      const result = analyzeSignals(
        "Act immediately to protect your account.",
      );

      expect(result.signals.map((s) => s.signal)).toContain("urgency");
    });

    it("detects multiple high-risk signals", () => {
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

    it("detects prize language", () => {
      const result = analyzeSignals(
        "Congratulations, you've won a prize!",
      );

      expect(result.signals.map((s) => s.signal)).toContain(
        "prize_or_reward",
      );
    });

    it("detects investment promises", () => {
      const result = analyzeSignals(
        "Guaranteed profit with no risk.",
      );

      expect(result.signals.map((s) => s.signal)).toContain(
        "investment_promise",
      );
    });

    it("detects payment requests", () => {
      const result = analyzeSignals(
        "Please send money to complete the transaction.",
      );

      expect(result.signals.map((s) => s.signal)).toContain(
        "payment_request",
      );
    });

    it("detects suspicious URLs", () => {
      const result = analyzeSignals(
        "Please review this link: https://example.com/login",
      );

      expect(result.signals.map((s) => s.signal)).toContain(
        "suspicious_link",
      );
    });
  });

  describe("false-positive protection", () => {
    it("returns LOW for a normal family message", () => {
      const result = analyzeSignals(
        "Hi Mom, just checking in. Hope you are having a good day. Call me when you get a chance.",
      );

      expect(result.level).toBe("LOW");
      expect(result.score).toBe(0);
      expect(result.signals).toHaveLength(0);
    });

    it("does not treat the word bank alone as impersonation", () => {
      const result = analyzeSignals(
        "I went to the bank this morning and deposited my money.",
      );

      expect(result.signals.map((s) => s.signal)).not.toContain(
        "impersonation",
      );
    });

    it("does not treat the word today alone as urgency", () => {
      const result = analyzeSignals(
        "I will call you today after work.",
      );

      expect(result.signals.map((s) => s.signal)).not.toContain(
        "urgency",
      );
    });

    it("does not treat normal payment discussion as a scam signal", () => {
      const result = analyzeSignals(
        "I made the payment for the electricity bill yesterday.",
      );

      expect(result.signals.map((s) => s.signal)).not.toContain(
        "payment_request",
      );
    });

    it("does not treat a normal website reference as suspicious", () => {
      const result = analyzeSignals(
        "The school website has the new timetable.",
      );

      expect(result.signals.map((s) => s.signal)).not.toContain(
        "suspicious_link",
      );
    });
  });

  describe("risk severity", () => {
    it("keeps a simple prize announcement below HIGH without a payment request", () => {
      const result = analyzeSignals(
        "Congratulations, you've won a prize!",
      );

      expect(result.level).not.toBe("HIGH");
    });

    it("raises a prize scam with a processing fee to HIGH", () => {
      const result = analyzeSignals(
        "Congratulations! You've won $50,000. Pay a processing fee today to claim your prize.",
      );

      expect(result.level).toBe("HIGH");
      expect(result.score).toBeGreaterThanOrEqual(75);
    });

    it("raises an OTP request combined with urgency and account threat to HIGH", () => {
      const result = analyzeSignals(
        "URGENT! Your account will be suspended. Send your OTP immediately.",
      );

      expect(result.level).toBe("HIGH");
      expect(result.score).toBeGreaterThanOrEqual(75);
    });

    it("keeps a generic investment inquiry below HIGH", () => {
      const result = analyzeSignals(
        "Hello, I am contacting you about an investment opportunity. We can discuss the details and expected returns if you are interested.",
      );

      expect(result.level).not.toBe("HIGH");
    });
  });

  describe("baseline behavior", () => {
    it("returns LOW when no known signals are detected", () => {
      const result = analyzeSignals(
        "Here is the recipe we discussed yesterday.",
      );

      expect(result.score).toBe(0);
      expect(result.level).toBe("LOW");
      expect(result.signals).toHaveLength(0);
    });
  });
});
