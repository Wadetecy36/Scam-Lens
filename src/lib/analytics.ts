import { env } from "@/config/env";

export type AnalyticsEvent =
  | "analysis_started"
  | "analysis_completed"
  | "analysis_failed"
  | "result_viewed"
  | "result_saved"
  | "simple_explanation_used"
  | "read_aloud_used"
  | "family_request_started"
  | "signup_completed"
  | "subscription_started";

/**
 * Product analytics stub. Only ever accepts non-sensitive metadata —
 * category, risk level, boolean flags. Never pass message/screenshot/URL
 * content here. Wire to a real analytics provider in Phase 2.
 */
export function track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
  if (!env.analyticsEnabled) return;
  // eslint-disable-next-line no-console
  console.debug("[analytics]", event, properties ?? {});
}
