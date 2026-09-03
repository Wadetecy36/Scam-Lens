const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
  aiApiKey: process.env.AI_API_KEY ?? "",
  virustotalApiKey: process.env.VIRUSTOTAL_API_KEY ?? "",
} as const;
