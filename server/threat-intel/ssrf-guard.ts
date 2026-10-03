/**
 * Defensive SSRF guard to protect against requests targeting localhost,
 * private networks, link-local addresses, or cloud metadata endpoints.
 */
export function isSafePublicUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Localhost and loopback
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]"
    ) {
      return false;
    }

    // Cloud metadata endpoints (AWS, GCP, Azure, DigitalOcean)
    if (
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal" ||
      hostname === "instance-data"
    ) {
      return false;
    }

    // Private IPv4 ranges:
    // 10.0.0.0/8
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return false;
    }

    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    const match172 = /^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(hostname);
    if (match172) {
      const secondOctet = Number(match172[1]);
      if (secondOctet >= 16 && secondOctet <= 31) {
        return false;
      }
    }

    // 192.168.0.0/16
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return false;
    }

    // Link-local 169.254.0.0/16
    if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return false;
    }

    // Private/internal domain patterns
    if (
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".corp") ||
      hostname.endsWith(".lan") ||
      hostname.endsWith(".test")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
