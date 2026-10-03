import { describe, expect, it } from "vitest";
import { redactPII } from "./pii-redactor.js";

describe("redactPII", () => {
  it("redacts the email user but keeps the domain as evidence", () => {
    const r = redactPII("Contact kofi.mensah@paypa1.com now");
    expect(r.text).toBe("Contact [EMAIL]@paypa1.com now");
    expect(r.counts.EMAIL).toBe(1);
  });

  it("redacts Ghana and international phone numbers", () => {
    const r = redactPII("Call 024 123 4567 or +233 24 123 4567 or 0241234567");
    expect(r.text).toBe("Call [PHONE] or [PHONE] or [PHONE]");
    expect(r.counts.PHONE).toBe(3);
  });

  it("redacts Luhn-valid card numbers only", () => {
    const r = redactPII("Card 4111 1111 1111 1111 expires soon");
    expect(r.text).toBe("Card [CARD] expires soon");
  });

  it("redacts Ghana Card IDs", () => {
    expect(redactPII("ID GHA-123456789-0").text).toBe("ID [GHANA_CARD]");
  });

  it("redacts SSNs", () => {
    expect(redactPII("SSN 123-45-6789").text).toBe("SSN [SSN]");
  });

  it("redacts OTP codes and passwords but keeps the request wording", () => {
    const r = redactPII("Your verification code is 482913. password: hunter2");
    expect(r.text).toBe("Your verification code is [CODE]. password: [SECRET]");
  });

  it("redacts labelled names and long account/routing numbers", () => {
    const r = redactPII("Account Name:      Johnathon Doe\nRouting / Sort:    021000021");
    expect(r.text).toBe("Account Name:      [NAME]\nRouting / Sort:    [BANK_NUMBER]");
  });

  it("does NOT strip scam evidence: URLs, amounts, dates, masked numbers", () => {
    const input =
      "Pay $4,250.00 by 2026-10-31 at https://bit.ly/abc. Acct XXXX-XXXX-8921.";
    const r = redactPII(input);
    expect(r.text).toBe(input);
    expect(r.counts).toEqual({});
  });

  it("leaves a plain scam message untouched", () => {
    const input = "Please download AnyDesk so our agent can fix your account.";
    expect(redactPII(input).text).toBe(input);
  });
});
