export type RiskSignal =
  | "urgency"
  | "threat"
  | "credential_request"
  | "payment_request"
  | "suspicious_link"
  | "impersonation"
  | "prize_or_reward"
  | "investment_promise"
  | "too_good_to_be_true";

export interface DetectedSignal {
  signal: RiskSignal;
  weight: number;
  explanation: string;
}
