import { describe, expect, it } from "vitest";
import { analyzeOfflineScam } from "@/risk/offline-analyzer";

describe("OfflineRiskAnalyzer (On-Device Zero Data Engine)", () => {
  it("detects mobile money fake reversal scam offline with HIGH risk", () => {
    const analysis = analyzeOfflineScam({
      type: "message",
      text: "Hello, I mistakenly sent 500 GHS to your MoMo wallet. Please reverse the transaction immediately or approve the prompt on your phone.",
    });

    expect(analysis.riskLevel).toBe("HIGH");
    expect(analysis.riskScore).toBeGreaterThanOrEqual(85);
    expect(analysis.id).toMatch(/^offline_/);
    expect(analysis.recommendedActions.length).toBeGreaterThan(0);
    expect(analysis.threatIntel).toBeDefined();
    expect(analysis.threatIntel?.[0].provider).toBe("ScamLens On-Device Offline Engine");
  });

  it("detects bank OTP phishing scam offline with HIGH risk", () => {
    const analysis = analyzeOfflineScam({
      type: "message",
      text: "Your bank account has been suspended due to unauthorized activity. Send your OTP and PIN immediately to keep your account open.",
    });

    expect(analysis.riskLevel).toBe("HIGH");
    expect(analysis.category).toBe("banking_scam");
    expect(analysis.warningSigns.some((w) => w.type === "credential_request" || w.type === "threat")).toBe(true);
  });

  it("evaluates benign everyday messages as LOW risk offline", () => {
    const analysis = analyzeOfflineScam({
      type: "message",
      text: "Hi Mom, what time are we having dinner tonight? I am bringing the groceries.",
    });

    expect(analysis.riskLevel).toBe("LOW");
    expect(analysis.riskScore).toBe(0);
    expect(analysis.warningSigns).toHaveLength(0);
  });

  it("flags suspicious urgency and investment promises with high caution", () => {
    const analysis = analyzeOfflineScam({
      type: "message",
      text: "Invest 200 today and receive guaranteed profit of 2000 within 24 hours! Risk-free investment opportunity.",
    });

    expect(analysis.riskLevel).toBe("HIGH");
    expect(analysis.category).toBe("investment_scam");
  });

  it("produces valid plain language explanations in all four registers", () => {
    const analysis = analyzeOfflineScam({
      type: "message",
      text: "MTN MoMo: Urgent action required. Your SIM card will be deactivated unless you update your KYC details now.",
    });

    expect(analysis.explanations.simple).toBeTruthy();
    expect(analysis.explanations.family).toBeTruthy();
    expect(analysis.explanations.technical).toBeTruthy();
    expect(analysis.explanations.voice).toBeTruthy();
  });
});
