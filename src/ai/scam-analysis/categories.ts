import type { ScamCategory } from "./schema";

/**
 * Human-readable labels for each category. New categories can be appended to
 * SCAM_CATEGORIES in schema.ts and given a label here without touching UI code.
 */
export const CATEGORY_LABELS: Record<ScamCategory, string> = {
  phishing: "Phishing",
  impersonation: "Impersonation",
  fake_prize: "Fake prize or lottery",
  fake_job_offer: "Fake job offer",
  investment_scam: "Investment scam",
  romance_scam: "Romance scam",
  payment_scam: "Payment scam",
  banking_scam: "Banking scam",
  account_takeover: "Account takeover attempt",
  credential_harvesting: "Credential harvesting",
  fake_customer_support: "Fake customer support",
  delivery_scam: "Delivery scam",
  government_impersonation: "Government impersonation",
  charity_scam: "Charity scam",
  emergency_scam: "Family emergency scam",
  extortion: "Blackmail or extortion",
  marketplace_scam: "Marketplace scam",
  malicious_link: "Malicious link",
  social_engineering: "Social engineering",
  advance_fee_scam: "Advance-fee scam",
  other: "Other",
};
