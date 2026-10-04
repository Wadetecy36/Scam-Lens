import { beforeAll, afterAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createAppServer } from "../index.js";
import { setAIProvider } from "../providers/index.js";
import { ServerMockAIProvider } from "../providers/mock-provider.js";

interface BenchmarkCase {
  name: string;
  content: string;
  expected: "LOW" | "CAUTION" | "SUSPICIOUS" | "HIGH";
}

const cases: BenchmarkCase[] = [
  {
    name: "Bank OTP scam",
    content:
      "URGENT! Your bank account will be suspended today. Send your OTP immediately to prevent closure.",
    expected: "HIGH",
  },
  {
    name: "Fake prize processing fee",
    content:
      "Congratulations! You've won $50,000. Pay a processing fee today to claim your prize.",
    expected: "HIGH",
  },
  {
    name: "Fake Microsoft support",
    content:
      "Your Microsoft account has a security problem. Contact the Microsoft support agent immediately and provide your security code.",
    expected: "HIGH",
  },
  {
    name: "Fake police threat",
    content:
      "This is a police officer. Send the payment immediately or legal action and arrest will follow.",
    expected: "HIGH",
  },
  {
    name: "Investment guaranteed profit",
    content:
      "Invest $500 today and receive guaranteed profit of $5,000 within 24 hours. Risk-free investment.",
    expected: "HIGH",
  },
  {
    name: "Fake delivery payment",
    content:
      "Your package is waiting for delivery. Pay the delivery fee immediately using this link: https://example.com/pay",
    expected: "HIGH",
  },
  {
    name: "Account suspension phishing",
    content:
      "Your account will be closed today. Verify your password and OTP immediately at https://example.com/login",
    expected: "HIGH",
  },
  {
    name: "Gift card payment scam",
    content:
      "You must buy a $500 gift card and send the code immediately to complete your account verification.",
    expected: "HIGH",
  },
  {
    name: "Fake government fine",
    content:
      "Government official notice: pay your outstanding penalty today or legal action will begin.",
    expected: "SUSPICIOUS",
  },
  {
    name: "Fake lottery",
    content:
      "You are the winner of our international lottery. Pay the claim fee today to receive your winnings.",
    expected: "HIGH",
  },

  {
    name: "Investment inquiry",
    content:
      "Hello, I am contacting you about an investment opportunity. We can discuss the details and expected returns if you are interested.",
    expected: "LOW",
  },
  {
    name: "Bank visit",
    content:
      "I went to the bank this morning and deposited my money.",
    expected: "LOW",
  },
  {
    name: "Normal payment",
    content:
      "I made the payment for the electricity bill yesterday.",
    expected: "LOW",
  },
  {
    name: "Normal website",
    content:
      "The school website has the new timetable.",
    expected: "LOW",
  },
  {
    name: "Normal account discussion",
    content:
      "I need to check my account balance before I go shopping.",
    expected: "LOW",
  },
  {
    name: "Possible unsolicited investment",
    content:
      "We have an investment opportunity available and would like to discuss our expected returns with you.",
    expected: "CAUTION",
  },
  {
    name: "Unexpected reward",
    content:
      "Congratulations, you've won a prize!",
    expected: "CAUTION",
  },
  {
    name: "Possible suspicious link",
    content:
      "Please review this link: https://example.com/login",
    expected: "CAUTION",
  },
  {
    name: "Account warning",
    content:
      "Your account may be suspended if you do not complete the required verification.",
    expected: "SUSPICIOUS",
  },
  {
    name: "Possible payment request",
    content:
      "Please send money to complete the transaction.",
    expected: "CAUTION",
  },

  {
    name: "Family check-in",
    content:
      "Hi Mom, just checking in. Hope you are having a good day. Call me when you get a chance.",
    expected: "LOW",
  },
  {
    name: "Dinner message",
    content:
      "Can you pick up some food on your way home? Thanks.",
    expected: "LOW",
  },
  {
    name: "School message",
    content:
      "The school has published the new timetable. Please check it when you have time.",
    expected: "LOW",
  },
  {
    name: "Work message",
    content:
      "The meeting has been moved to tomorrow afternoon. I'll send the updated schedule.",
    expected: "LOW",
  },
  {
    name: "Normal shopping",
    content:
      "I bought the shoes online and they should arrive next week.",
    expected: "LOW",
  },
  {
    name: "Normal banking",
    content:
      "I transferred money to my savings account after receiving my salary.",
    expected: "LOW",
  },
  {
    name: "Normal payment reminder",
    content:
      "Please remember to make the rent payment before Friday.",
    expected: "LOW",
  },
  {
    name: "Normal delivery",
    content:
      "The package arrived this morning. I'll bring it home later.",
    expected: "LOW",
  },
  {
    name: "Normal work link",
    content:
      "Here is the website for the conference registration. Let me know if you need help.",
    expected: "LOW",
  },
  {
    name: "Normal conversation",
    content:
      "I'll call you later when I finish work. Take care.",
    expected: "LOW",
  },
];

describe("ScamLens AI → Risk Engine Pipeline Benchmark", () => {
  let server: Server | undefined;
  let baseUrl: string;

  beforeAll(async () => {
    setAIProvider(new ServerMockAIProvider());

    if (process.env.SCAMLENS_BENCHMARK_URL) {
      baseUrl = process.env.SCAMLENS_BENCHMARK_URL;
    } else {
      server = createAppServer();
      await new Promise<void>((resolve) => {
        server!.listen(0, "127.0.0.1", () => resolve());
      });
      const addr = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${addr.port}`;
    }
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server!.close(() => resolve());
      });
    }
  });

  it("runs the production analyze endpoint against 30 cases", async () => {
    const results: Array<{
      name: string;
      expected: string;
      actual: string;
      score?: number;
      category?: string;
      correct: boolean;
      error?: string;
    }> = [];

    for (const testCase of cases) {
      try {
        const response = await fetch(`${baseUrl}/api/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "message",
            content: testCase.content,
          }),
        });

        const data = (await response.json()) as any;

        const actual =
          data?.analysis?.riskLevel ??
          data?.riskLevel ??
          "UNKNOWN";

        const score =
          data?.analysis?.riskScore ??
          data?.riskScore;

        const category =
          data?.analysis?.category ??
          data?.category;

        results.push({
          name: testCase.name,
          expected: testCase.expected,
          actual,
          score,
          category,
          correct: actual === testCase.expected,
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          expected: testCase.expected,
          actual: "ERROR",
          correct: false,
          error: String(error),
        });
      }
    }

    const correct = results.filter(
      (result) => result.correct,
    ).length;

    const accuracy = (correct / results.length) * 100;

    console.log("\n");
    console.log("==========================================");
    console.log("ScamLens AI PIPELINE BENCHMARK");
    console.log("==========================================");
    console.log(
      `Accuracy: ${correct}/${results.length} (${accuracy.toFixed(1)}%)`,
    );
    console.log("==========================================");

    for (const result of results) {
      const icon = result.correct ? "✓" : "✗";

      console.log(
        `${icon} ${result.name}`,
        `| expected=${result.expected}`,
        `| actual=${result.actual}`,
        result.score !== undefined
          ? `| score=${result.score}`
          : "",
        result.category
          ? `| category=${result.category}`
          : "",
        result.error
          ? `| error=${result.error}`
          : "",
      );
    }

    console.log("==========================================");
    console.log("\n");

    expect(results).toHaveLength(cases.length);

    // Enforce 100% accuracy on the production analyze pipeline
    expect(correct).toBe(cases.length);
  });
});
