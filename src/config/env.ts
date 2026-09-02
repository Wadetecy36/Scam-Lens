/**
 * Client-safe environment configuration.
 *
 * IMPORTANT: only VITE_-prefixed variables are exposed to the client bundle
 * by Vite. Never place secrets (AI provider API keys, server credentials)
 * in a VITE_ variable those belong server-side only (see server/.env.example).
 */

export const env = {
  appEnv: (import.meta.env.VITE_APP_ENV ?? "development") as "development" | "staging" | "production",
  appUrl: import.meta.env.VITE_APP_URL ?? "http://localhost:5173",
  analyticsEnabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
  /** Feature flag: real AI provider vs mock. Server decides the real switch; this only affects local dev UX. */
  useMockAnalysis: import.meta.env.VITE_USE_MOCK_ANALYSIS !== "false",
} as const;
