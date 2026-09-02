import type { ScamAnalysis } from "../scam-analysis/schema";

type MockScenario = Omit<ScamAnalysis, "id" | "createdAt">;

/**
 * Realistic mock scenarios so the frontend can be built and demoed fully
 * independently of a real AI provider. No real people's information is used.
 */
export const MOCK_SCENARIOS: Record<string, MockScenario> = {
  fake_prize: {
    schemaVersion: 1,
    inputType: "message",
    category: "fake_prize",
    riskScore: 91,
    riskLevel: "HIGH",
    summary: "This message contains several warning signs commonly associated with prize scams.",
    warningSigns: [
      {
        type: "urgency",
        severity: "high",
        explanation: "The message pressures you to act immediately or lose the prize.",
      },
      {
        type: "unsolicited_prize",
        severity: "high",
        explanation: "You're told you won something you never entered to win.",
      },
      {
        type: "link_to_claim",
        severity: "high",
        explanation: "You're asked to click a link to \"claim\" the prize before verifying anything.",
      },
    ],
    recommendedActions: [
      "Do not click the link.",
      "Do not reply with any personal details.",
      "Delete the message, or block the sender.",
    ],
    avoidActions: ["Do not share your PIN.", "Do not share your OTP.", "Do not provide your bank details."],
    explanations: {
      technical: "The message demonstrates multiple social-engineering indicators typical of advance-fee prize fraud.",
      simple: "This message is trying to make you act quickly over a prize you didn't enter to win. Don't click the link or share any details.",
      family: "Someone is pretending your parent won a prize to get them to click a link. It's very likely fake — worth a quick check-in.",
      voice: "This looks like a prize scam. Don't click the link. Don't share any personal information. If you're not sure, ask someone you trust.",
    },
    confidence: 0.91,
  },

  fake_bank: {
    schemaVersion: 1,
    inputType: "message",
    category: "banking_scam",
    riskScore: 88,
    riskLevel: "HIGH",
    summary: "This message imitates a bank alert and pushes you toward an urgent link.",
    warningSigns: [
      {
        type: "impersonation",
        severity: "high",
        explanation: "The message claims to be from your bank but doesn't come from an official channel.",
      },
      {
        type: "urgency",
        severity: "high",
        explanation: "It warns your account will be blocked today unless you act now.",
      },
      {
        type: "credential_request",
        severity: "high",
        explanation: "The linked page will likely ask for your login details or card information.",
      },
    ],
    recommendedActions: [
      "Do not tap the link in the message.",
      "Open your bank's app directly, or call the number on the back of your card.",
      "Report the message to your bank.",
    ],
    avoidActions: ["Do not enter your PIN.", "Do not enter your online banking password.", "Do not share an OTP."],
    explanations: {
      technical: "The message uses brand impersonation combined with urgency and a credential-harvesting link.",
      simple: "This message pretends to be your bank and wants you to click a link fast. Real banks don't ask you to verify your account this way. Contact your bank directly using a number you already trust.",
      family: "Someone is pretending to be your parent's bank to get them to click a link and enter their details. Recommend calling the bank directly instead.",
      voice: "This message is pretending to be your bank. Don't click the link. Call your bank directly using the number on your card instead.",
    },
    confidence: 0.88,
  },

  fake_delivery: {
    schemaVersion: 1,
    inputType: "message",
    category: "delivery_scam",
    riskScore: 72,
    riskLevel: "SUSPICIOUS",
    summary: "This message resembles a delivery notice used to collect a small payment or personal details.",
    warningSigns: [
      {
        type: "small_fee_request",
        severity: "medium",
        explanation: "You're asked to pay a small \"customs\" or \"redelivery\" fee to release a package.",
      },
      {
        type: "vague_sender",
        severity: "medium",
        explanation: "The courier name doesn't match a service you've actually used.",
      },
      {
        type: "link_to_pay",
        severity: "high",
        explanation: "Payment happens through an unfamiliar link rather than the courier's official app or site.",
      },
    ],
    recommendedActions: [
      "Track the package directly on the courier's official website or app.",
      "Do not pay through a link in a text message.",
      "Contact the courier through their official customer service number.",
    ],
    avoidActions: ["Do not enter card details on the linked page.", "Do not share your address to \"confirm\" delivery."],
    explanations: {
      technical: "The message uses a low-friction micro-payment lure combined with an unverified delivery brand.",
      simple: "This looks like a fake delivery message asking for a small payment through a link. Check your order directly on the courier's real website instead of clicking the link.",
      family: "This is a common trick — a fake delivery text asking for a small fee. It's safest to check the tracking number on the courier's real site.",
      voice: "This looks like a fake delivery message. Don't pay through the link. Check your package directly on the courier's website instead.",
    },
    confidence: 0.74,
  },

  fake_job_offer: {
    schemaVersion: 1,
    inputType: "message",
    category: "fake_job_offer",
    riskScore: 79,
    riskLevel: "SUSPICIOUS",
    summary: "This offer has signs common to fake remote-work job scams.",
    warningSigns: [
      {
        type: "unrealistic_pay",
        severity: "medium",
        explanation: "The pay offered is high for very little described work.",
      },
      {
        type: "upfront_payment",
        severity: "high",
        explanation: "You're asked to pay for training materials or equipment before starting.",
      },
      {
        type: "messaging_app_only",
        severity: "medium",
        explanation: "Communication happens only through chat, with no company website or verifiable address.",
      },
    ],
    recommendedActions: [
      "Look up the company independently — check for a real website and reviews.",
      "Never pay money to accept a job offer.",
      "Ask to speak with someone by video call before proceeding.",
    ],
    avoidActions: ["Do not send money for \"training\" or \"equipment\".", "Do not share your bank details to be \"set up for payroll\"."],
    explanations: {
      technical: "The offer combines unrealistic compensation with an upfront payment requirement, a common advance-fee job scam pattern.",
      simple: "A real job will never ask you to pay money first. Be cautious about this offer, and look up the company on your own before responding.",
      family: "This job offer asks for money upfront, which real employers don't do. Worth double-checking before your family member replies.",
      voice: "Be careful with this job offer. Real jobs don't ask you to pay first. Look up the company yourself before you respond.",
    },
    confidence: 0.79,
  },

  investment_scam: {
    schemaVersion: 1,
    inputType: "message",
    category: "investment_scam",
    riskScore: 85,
    riskLevel: "HIGH",
    summary: "This message promotes an investment with guaranteed high returns, a strong scam indicator.",
    warningSigns: [
      {
        type: "guaranteed_returns",
        severity: "high",
        explanation: "Legitimate investments cannot guarantee high returns with no risk.",
      },
      {
        type: "unregistered_platform",
        severity: "high",
        explanation: "The platform mentioned isn't a recognized, regulated investment service.",
      },
      { type: "referral_pressure", severity: "medium", explanation: "You're encouraged to recruit friends or family to join." },
    ],
    recommendedActions: [
      "Do not send money or crypto to this platform.",
      "Check whether the platform is registered with a real financial regulator.",
      "Talk to a trusted, independent financial advisor before investing anything.",
    ],
    avoidActions: ["Do not share your bank login.", "Do not send an initial \"deposit\" to unlock returns."],
    explanations: {
      technical: "The message exhibits guaranteed-return claims and referral-based growth, both common in Ponzi-style investment fraud.",
      simple: "No real investment can guarantee big, risk-free returns. This has strong signs of an investment scam — don't send any money.",
      family: "This promises guaranteed profits, which is a classic scam sign. Worth a conversation before any money is sent.",
      voice: "This investment promises guaranteed profits, which is not realistic. Please don't send any money until you've checked with someone you trust.",
    },
    confidence: 0.87,
  },

  fake_emergency: {
    schemaVersion: 1,
    inputType: "call",
    category: "emergency_scam",
    riskScore: 83,
    riskLevel: "HIGH",
    summary: "This description matches a family-emergency scam call, designed to create panic and rush a payment.",
    warningSigns: [
      {
        type: "panic_inducing",
        severity: "high",
        explanation: "The caller claims a family member is in trouble and needs money right now.",
      },
      { type: "request_secrecy", severity: "high", explanation: "You're told not to tell other family members." },
      { type: "unusual_payment_method", severity: "high", explanation: "Payment is requested via gift cards, wire transfer, or crypto." },
    ],
    recommendedActions: [
      "Hang up and call your family member directly using a number you already have.",
      "Confirm the story with another family member before sending anything.",
      "Never send money based on a single unverified call.",
    ],
    avoidActions: ["Do not buy gift cards to pay a caller.", "Do not wire money before verifying the story independently."],
    explanations: {
      technical: "The call pattern matches emergency-scam social engineering: induced panic, secrecy request, and an unusual payment channel.",
      simple: "This sounds like a scam call pretending to be a family emergency. Hang up and call your family member directly to check.",
      family: "Someone may have called claiming to be you or in trouble. It's worth confirming with your parent that everyone is safe, and that no money should be sent.",
      voice: "This sounds like an emergency scam call. Please hang up, and call your family member directly using a number you already have.",
    },
    confidence: 0.83,
  },

  suspicious_verification: {
    schemaVersion: 1,
    inputType: "message",
    category: "account_takeover",
    riskScore: 68,
    riskLevel: "SUSPICIOUS",
    summary: "This message asks you to \"verify\" your account through a link rather than the app itself.",
    warningSigns: [
      { type: "verification_via_link", severity: "high", explanation: "Legitimate account verification usually happens inside the app, not via an outside link." },
      { type: "mild_urgency", severity: "medium", explanation: "You're told your account will be limited soon if you don't respond." },
    ],
    recommendedActions: [
      "Open the official app directly instead of using the link.",
      "Check your account status inside the app.",
      "If concerned, contact the company through their official support channel.",
    ],
    avoidActions: ["Do not enter your password on the linked page.", "Do not share a verification code you receive by text."],
    explanations: {
      technical: "The message uses an out-of-band verification link, a common credential-harvesting pattern.",
      simple: "It's safer to check your account by opening the app directly rather than tapping this link.",
      family: "This looks like a common account-verification trick. Suggest opening the app directly instead of the link.",
      voice: "It's safer to check this by opening the app yourself instead of tapping the link in the message.",
    },
    confidence: 0.68,
  },

  legitimate_low_risk: {
    schemaVersion: 1,
    inputType: "message",
    category: "other",
    riskScore: 8,
    riskLevel: "LOW",
    summary: "We didn't find warning signs commonly associated with scams in this message.",
    warningSigns: [],
    recommendedActions: ["If you're still unsure, you can confirm with the sender directly through a channel you already trust."],
    avoidActions: ["Still avoid sharing passwords, PINs, or OTPs with anyone who contacts you first."],
    explanations: {
      technical: "No significant social-engineering, urgency, or credential-harvesting indicators were detected.",
      simple: "This message doesn't show the usual warning signs of a scam. It's always fine to double-check with the sender directly if you're unsure.",
      family: "This one looks fine, but it's always okay to double check if something feels off.",
      voice: "This message looks okay. If you're still unsure, it's always fine to check directly with the sender.",
    },
    confidence: 0.72,
  },
};

export type MockScenarioKey = keyof typeof MOCK_SCENARIOS;

/** Very lightweight heuristic used only to pick a believable mock scenario from free text. */
export function pickScenarioForText(text: string): MockScenarioKey {
  const t = text.toLowerCase();
  if (/(won|winner|prize|congratulations|lottery)/.test(t)) return "fake_prize";
  if (/(bank|account.*(block|suspend|verify)|otp)/.test(t)) return "fake_bank";
  if (/(delivery|courier|package|customs|redeliver)/.test(t)) return "fake_delivery";
  if (/(job|hiring|work from home|salary|recruit)/.test(t)) return "fake_job_offer";
  if (/(invest|crypto|returns|profit|trading)/.test(t)) return "investment_scam";
  if (/(emergency|arrested|hospital|accident|bail)/.test(t)) return "fake_emergency";
  if (/(verify your account|confirm your account|click to verify)/.test(t)) return "suspicious_verification";
  return "legitimate_low_risk";
}
