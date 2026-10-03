export type RiskSignal =
  | "urgency"
  | "threat"
  | "credential_request"
  | "payment_request"
  | "suspicious_link"
  | "impersonation"
  | "prize_or_reward"
  | "investment_promise"
  | "too_good_to_be_true"
  | "fake_document"
  // Benchmark extensions
  | "URGENCY_ARTIFICIAL"
  | "AUTHORITY_IMPERSONATION"
  | "FEAR_COERCION"
  | "GREED_INCENTIVE"
  | "RELATIONSHIP_HIJACK"
  | "URL_OBFUSCATION"
  | "TYPOSQUATTING_DOMAIN"
  | "OFF_PLATFORM_DIVERSION"
  | "HOMOGLYPH_UNICODE_ATTACK"
  | "UNSTRUCTURED_CONTACT_INFO"
  | "MFA_OTP_SOLICITATION"
  | "IRREVERSIBLE_PAYMENT_DEMAND"
  | "ADVANCE_FEE_SOLICITATION"
  | "REMOTE_ACCESS_PROMPT"
  | "SYNTHETIC_DOCUMENT_MARKER"
  | "ARITHMETIC_MISMATCH"
  | "RAPID_LAYERING"
  | "INVALID_ABA_CHECKSUM";

export interface DetectedSignal {
  signal: RiskSignal;
  weight: number;
  explanation: string;
}
