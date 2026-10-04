const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

/**
 * Browser origins allowed to call this API.
 *
 * Local dev + preview origins are always allowed. Add production origins
 * with a comma-separated ALLOWED_ORIGINS env var, e.g.
 *   ALLOWED_ORIGINS=https://scamlens.app,https://www.scamlens.app
 */
const DEFAULT_ALLOWED_ORIGINS = [
  // Local development and preview
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
  // Production
  "https://scam-lens-blue.vercel.app",
];

function parseOrigins(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
  aiApiKey: process.env.AI_API_KEY ?? "",
  virustotalApiKey: process.env.VIRUSTOTAL_API_KEY ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioWebhookUrl: process.env.TWILIO_WEBHOOK_URL ?? "",
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET ?? process.env.META_APP_SECRET ?? "",
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "scamlens_verify_token",
  dataDir: process.env.SCAMLENS_DATA_DIR ?? "",
  allowedOrigins: [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...parseOrigins(process.env.ALLOWED_ORIGINS),
  ],
} as const;
