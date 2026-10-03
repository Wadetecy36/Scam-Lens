import { describe, expect, it } from "vitest";
import { analyzeSignals } from "./engine.js";

describe("Ghanaian & Mobile Money Scam Scenarios", () => {
  it("detects fake MoMo reversal scam as HIGH", () => {
    const result = analyzeSignals(
      "Hello, I mistakenly transferred 500 GHS to your MoMo wallet. Please reverse the transaction and send it back immediately!",
    );
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("detects MoMo cash-out authorization prompt scam as HIGH", () => {
    const result = analyzeSignals(
      "MTN MoMo Alert: An authorization prompt has been sent to your phone. Enter your momo pin immediately to complete the reversal.",
    );
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("detects telecom SIM deactivation threat as HIGH", () => {
    const result = analyzeSignals(
      "Telecel Customer Care: Your line will be blocked today due to incomplete SIM registration. Contact our agent immediately or your wallet will be closed.",
    );
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("detects fake recruitment protocol fee as HIGH", () => {
    const result = analyzeSignals(
      "Ghana Police Service recruitment protocol forms are available. Pay the protocol fee of 300 GHS today to secure enlistment.",
    );
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("classifies normal everyday Ghanaian messages as LOW", () => {
    const r1 = analyzeSignals(
      "Hi Kwame, I will send you the MoMo for lunch tomorrow afternoon.",
    );
    expect(r1.level).toBe("LOW");

    const r2 = analyzeSignals(
      "Can we meet at the shop near Circle station around 3pm?",
    );
    expect(r2.level).toBe("LOW");

    const r3 = analyzeSignals(
      "Please remind Auntie Akua about the church harvest program on Sunday.",
    );
    expect(r3.level).toBe("LOW");
  });
});
