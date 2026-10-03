/**
 * PII redactor.
 *
 * Runs on the ScamLens server BEFORE any user content is sent to a
 * third-party AI provider. The deterministic risk engine still sees the
 * original text locally, so scam evidence is not lost — only the copy that
 * leaves our infrastructure is scrubbed.
 *
 * Design rules:
 * - Replace values with typed placeholders so the AI still understands the
 *   *shape* of the message ("they asked for your [CARD]").
 * - Keep evidence that is not personal: email domains (typosquatting), URLs.
 * - Never log the redacted values themselves — only counts.
 */

export type PIIKind =
  | "EMAIL"
  | "GHANA_CARD"
  | "CARD"
  | "IBAN"
  | "SSN"
  | "SECRET"
  | "CODE"
  | "PHONE"
  | "BANK_NUMBER"
  | "NAME";

export interface RedactionResult {
  text: string;
  counts: Partial<Record<PIIKind, number>>;
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

interface Rule {
  kind: PIIKind;
  pattern: RegExp;
  replace: (match: string, ...groups: string[]) => string | null; // null = leave untouched
}

// Order matters: more specific patterns run first so generic number rules
// don't swallow them.
const RULES: Rule[] = [
  {
    // Keep the domain — lookalike domains are scam evidence.
    kind: "EMAIL",
    pattern: /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
    replace: (_m, domain) => `[EMAIL]@${domain}`,
  },
  {
    // Labelled names on statements/forms, e.g. "Account Name: John Doe"
    kind: "NAME",
    pattern: /\b(account name|account holder|beneficiary|full name|customer name)(\s*[:\-]\s*)[^\n\r]+/gi,
    replace: (_m, label, sep) => `${label}${sep}[NAME]`,
  },
  {
    kind: "GHANA_CARD",
    pattern: /\bGHA-?\d{9}-?\d\b/gi,
    replace: () => "[GHANA_CARD]",
  },
  {
    kind: "CARD",
    pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
    replace: (m) => {
      const digits = m.replace(/[ -]/g, "");
      if (digits.length < 13 || digits.length > 19 || !luhnValid(digits)) return null;
      return "[CARD]";
    },
  },
  {
    kind: "IBAN",
    pattern: /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,4})?\b/g,
    replace: () => "[IBAN]",
  },
  {
    kind: "SSN",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replace: () => "[SSN]",
  },
  {
    // "password: hunter2", "PIN=1234"
    kind: "SECRET",
    pattern: /\b(password|passcode|passwd|pwd|pin)(\s*[:=]\s*)\S+/gi,
    replace: (_m, label, sep) => `${label}${sep}[SECRET]`,
  },
  {
    // "your code is 482913", "OTP: 1234"
    kind: "CODE",
    pattern: /\b(code|otp|token|verification)([^\d\n]{0,20})\b(\d{4,8})\b/gi,
    replace: (_m, label, gap) => `${label}${gap}[CODE]`,
  },
  {
    // International (+233 24 123 4567, +1 555 123 4567) or local Ghana (024 123 4567)
    kind: "PHONE",
    pattern: /(?<![\w+])(?:\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3}[\s.-]?\d{3,4}|0\d{2}[\s.-]?\d{3}[\s.-]?\d{4})(?![\w])/g,
    replace: () => "[PHONE]",
  },
  {
    // Remaining long digit runs: account / routing / MoMo wallet numbers
    kind: "BANK_NUMBER",
    pattern: /\b\d{8,17}\b/g,
    replace: () => "[BANK_NUMBER]",
  },
];

export function redactPII(input: string): RedactionResult {
  const counts: Partial<Record<PIIKind, number>> = {};
  let text = input;

  for (const rule of RULES) {
    text = text.replace(rule.pattern, (match: string, ...rest: unknown[]) => {
      // rest = [...groups, offset, fullString, (namedGroups?)]
      const groups = rest.filter((g): g is string => typeof g === "string").slice(0, -1);
      const replacement = rule.replace(match, ...groups);
      if (replacement === null) return match;
      counts[rule.kind] = (counts[rule.kind] ?? 0) + 1;
      return replacement;
    });
  }

  return { text, counts };
}
