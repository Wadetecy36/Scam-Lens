import crypto from "node:crypto";

/**
 * Bounded replay cache for Twilio MessageSids.
 * Stores entries with a timestamp to expire after 1 hour (3600 seconds).
 */
const processedTwilioSids = new Map<string, number>();
const TWILIO_REPLAY_WINDOW_MS = 3600 * 1000;
const MAX_REPLAY_CACHE_SIZE = 5000;

function cleanExpiredTwilioSids(): void {
  const now = Date.now();
  for (const [sid, timestamp] of processedTwilioSids.entries()) {
    if (now - timestamp > TWILIO_REPLAY_WINDOW_MS) {
      processedTwilioSids.delete(sid);
    }
  }
}

/**
 * Checks if a Twilio MessageSid has already been processed within the replay window.
 * Returns true if the message is fresh (not replayed), or false if it is a duplicate replay.
 */
export function checkAndRecordTwilioSid(messageSid: string | undefined): boolean {
  if (!messageSid) return true; // No SID to track

  cleanExpiredTwilioSids();

  if (processedTwilioSids.has(messageSid)) {
    return false; // Replayed message
  }

  if (processedTwilioSids.size >= MAX_REPLAY_CACHE_SIZE) {
    // Evict oldest entry
    const oldestKey = processedTwilioSids.keys().next().value;
    if (oldestKey) processedTwilioSids.delete(oldestKey);
  }

  processedTwilioSids.set(messageSid, Date.now());
  return true;
}

/**
 * Verifies inbound Twilio webhook request signature (HMAC-SHA1).
 * Twilio canonical specification:
 * 1. Takes the full webhook URL (including scheme, host, port, path, query).
 * 2. Takes the POST parameters, sorts keys alphabetically in ascending order.
 * 3. Appends each key and its value to the URL string with no delimiter.
 * 4. Signs with HMAC-SHA1 using TWILIO_AUTH_TOKEN as secret.
 * 5. Returns base64 encoded digest.
 * 6. Performs constant-time comparison against X-Twilio-Signature header.
 */
export function verifyTwilioWebhookSignature(options: {
  signature: string | undefined;
  url: string;
  params: Record<string, string>;
  authToken: string;
}): boolean {
  const { signature, url, params, authToken } = options;

  if (!signature || !authToken) {
    return false;
  }

  try {
    // Sort parameter keys alphabetically
    const sortedKeys = Object.keys(params).sort();

    // Construct validation payload: URL + sorted key/value pairs
    let data = url;
    for (const key of sortedKeys) {
      data += key + params[key];
    }

    const expectedSignature = crypto
      .createHmac("sha1", authToken)
      .update(Buffer.from(data, "utf8"))
      .digest("base64");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const actualBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Verifies inbound Meta WhatsApp Cloud API webhook request signature (HMAC-SHA256).
 * Meta canonical specification:
 * 1. Takes the raw HTTP request body string exactly as transmitted.
 * 2. Signs with HMAC-SHA256 using WHATSAPP_APP_SECRET as secret.
 * 3. Computes hex digest.
 * 4. Compares with header 'sha256=<digest>' using constant-time comparison.
 */
export function verifyMetaWebhookSignature(options: {
  signatureHeader: string | undefined;
  rawBody: string;
  appSecret: string;
}): boolean {
  const { signatureHeader, rawBody, appSecret } = options;

  if (!signatureHeader || !appSecret) {
    return false;
  }

  try {
    const parts = signatureHeader.split("=");
    if (parts.length !== 2 || parts[0] !== "sha256") {
      return false;
    }

    const expectedDigest = crypto
      .createHmac("sha256", appSecret)
      .update(Buffer.from(rawBody, "utf8"))
      .digest("hex");

    const expectedSignature = `sha256=${expectedDigest}`;

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const actualBuffer = Buffer.from(signatureHeader, "utf8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Validates Meta message timestamp against clock drift and replay attacks.
 * Rejects messages older than 15 minutes (900 seconds) or more than 60 seconds into the future.
 */
export function checkMetaTimestampValidity(
  timestampSeconds: number | string | undefined,
): boolean {
  if (timestampSeconds === undefined || timestampSeconds === null) {
    return true; // No timestamp in this event (e.g. status webhook)
  }

  const msgTime = Number(timestampSeconds);
  if (Number.isNaN(msgTime) || msgTime <= 0) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const diff = nowSeconds - msgTime;

  // Reject if older than 15 minutes (900s) or more than 60s in the future
  if (diff > 900 || diff < -60) {
    return false;
  }

  return true;
}
