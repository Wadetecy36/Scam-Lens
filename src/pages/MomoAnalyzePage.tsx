import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PhoneCall, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { TextAreaField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

const SAMPLE_MOMO_SCAMS = [
  {
    label: "Fake MoMo Reversal",
    sender: "phone",
    text: "Payment received for GHS 500.00 from KWAME ASANTE. Current Balance: GHS 520.00. Reference: 2948201938. Available Balance: GHS 520.00.",
  },
  {
    label: "Cash-Out Prompt Trap",
    sender: "phone",
    text: "Cash Out: Authorize payment of GHS 450.00 to CASHOUT AGENT KANESHIE. Approve prompt on your phone or enter PIN now to release funds.",
  },
  {
    label: "SIM KYC Deactivation Threat",
    sender: "phone",
    text: "MTN MoMo Alert: Your SIM card and MoMo wallet will be blocked within 2 hours due to unverified Ghana Card. Call 0541234567 immediately to keep active.",
  },
];

export function MomoAnalyzePage() {
  useDocumentHead({
    title: "Verify MoMo SMS or Alert",
    description: "Check if a Mobile Money reversal request, transfer SMS, or cash-out prompt is a scam before sending money.",
    path: "/analyze/momo",
  });

  const [searchParams] = useSearchParams();
  const [senderType, setSenderType] = useState<"phone" | "official" | "unknown">("phone");
  const [text, setText] = useState(() => {
    const shared = searchParams.get("text") || "";
    return shared ? shared.trim() : "";
  });

  useEffect(() => {
    const shared = searchParams.get("text") || "";
    if (shared && !text) {
      setText(shared.trim());
    }
  }, [searchParams]);

  const invalid = text.trim().length < 10 || text.length > 10000;

  const getInput = (): ScamAnalysisInput => {
    const senderContext =
      senderType === "phone"
        ? "[Received from: Personal 10-digit Phone Number (e.g. 024/054/059)]\n"
        : senderType === "official"
        ? "[Received from: Official telecom header (e.g. 'MobileMoney' or 'MTN')]\n"
        : "";
    return {
      type: "message",
      text: `${senderContext}${text.trim()}`,
    };
  };

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) setText(clipboardText);
    } catch (e) {
      console.error("Clipboard access denied", e);
    }
  }

  return (
    <AnalysisInputPage
      type="message"
      title="Verify Mobile Money SMS"
      description="Check if an SMS transfer alert, reversal plea, or authorization prompt is genuine before you send money or dial any PIN."
      getInput={getInput}
      disabled={invalid}
    >
      {/* SENDER IDENTITY VERIFICATION */}
      <div className="mb-6 rounded-[var(--radius-card)] border border-border/20 bg-card p-4 sm:p-5">
        <label className="block text-sm font-semibold text-foreground">
          Who did the SMS come from?
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          Look at the top of your SMS app where the sender's name or number is displayed.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSenderType("phone")}
            className={`tap-target flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
              senderType === "phone"
                ? "border-amber-500 bg-amber-50/50 text-foreground dark:border-amber-600 dark:bg-amber-950/20"
                : "border-border/20 bg-background/50 hover:bg-muted/50"
            }`}
          >
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-amber-600 flex items-center justify-center">
              {senderType === "phone" && <span className="h-2 w-2 rounded-full bg-amber-600" />}
            </span>
            <div>
              <span className="block text-sm font-medium">A phone number</span>
              <span className="text-xs text-foreground-soft">e.g. 024..., 059..., 055..., +233...</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSenderType("official")}
            className={`tap-target flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
              senderType === "official"
                ? "border-primary bg-primary-soft/40 text-foreground"
                : "border-border/20 bg-background/50 hover:bg-muted/50"
            }`}
          >
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary flex items-center justify-center">
              {senderType === "official" && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <div>
              <span className="block text-sm font-medium">Official telecom header</span>
              <span className="text-xs text-foreground-soft">e.g. "MobileMoney", "MTN", "Telecel"</span>
            </div>
          </button>
        </div>

        {senderType === "phone" && (
          <aside className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/80 p-3 text-sm text-red-950 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200" role="alert">
            <ShieldAlert className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" size={18} aria-hidden="true" />
            <div>
              <strong className="font-semibold">Critical Red Flag:</strong> Legitimate MTN MoMo and Telecel Cash alerts <em>never</em> come from a personal 10-digit phone number. If someone sent this from a normal SIM card, it is almost certainly a scam!
            </div>
          </aside>
        )}
      </div>

      {/* SAMPLE SHORTCUTS */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground-soft">
            Or try a common MoMo scam pattern:
          </span>
          <button
            type="button"
            onClick={handlePaste}
            className="tap-target inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Paste from clipboard
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_MOMO_SCAMS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setText(sample.text);
                setSenderType("phone");
              }}
              className="tap-target inline-flex items-center gap-1.5 rounded-full border border-border/30 bg-muted/40 px-3 py-1 text-xs text-foreground-soft hover:border-primary hover:text-primary transition-colors"
            >
              <Sparkles size={13} className="text-primary" />
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <TextAreaField
        label="MoMo SMS or message text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the SMS here (e.g. Payment received for GHS 500 from...)"
        rows={5}
        maxLength={10000}
        hint={`${text.length}/10,000 characters`}
        error={
          text.length > 0 && text.trim().length < 10
            ? "Add a little more of the message so we have enough context."
            : undefined
        }
      />

      {/* OFFICIAL USSD DIRECT DIAL ACTIONS */}
      <div className="mt-6 rounded-[var(--radius-card)] border border-border/10 bg-foreground/5 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
          <CheckCircle2 size={18} className="text-primary" /> Safe way to check your real balance:
        </h2>
        <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
          Never rely on SMS text messages to know if money arrived. Dial your provider's official short code directly to view your genuine statement:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="tel:*170%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <PhoneCall size={14} /> Dial *170# (MTN MoMo)
          </a>
          <a
            href="tel:*110%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-950 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          >
            <PhoneCall size={14} /> Dial *110# (Telecel Cash)
          </a>
          <a
            href="tel:*500%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-950 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200"
          >
            <PhoneCall size={14} /> Dial *500# (AT Money)
          </a>
        </div>
      </div>
    </AnalysisInputPage>
  );
}
