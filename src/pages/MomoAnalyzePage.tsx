import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PhoneCall, ShieldAlert, Sparkles, CheckCircle2, ClipboardPaste } from "lucide-react";
import { TextAreaField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

const SAMPLE_MOMO_SCAMS = [
  {
    label: "Fake MoMo Reversal",
    sender: "phone" as const,
    text: "Payment received for GHS 500.00 from KWAME ASANTE. Current Balance: GHS 520.00. Reference: 2948201938. Available Balance: GHS 520.00.",
  },
  {
    label: "Cash-Out Prompt Trap",
    sender: "phone" as const,
    text: "Cash Out: Authorize payment of GHS 450.00 to CASHOUT AGENT KANESHIE. Approve prompt on your phone or enter PIN now to release funds.",
  },
  {
    label: "SIM KYC Deactivation",
    sender: "phone" as const,
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
      <div className="rounded-2xl border border-border bg-white p-5 shadow-2xs">
        <label className="block text-sm font-bold text-navy">
          Who did the SMS come from?
        </label>
        <p className="mt-1 text-xs text-foreground-soft">
          Look at the top of your SMS app where the sender's name or number is displayed.
        </p>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSenderType("phone")}
            className={`tap-target flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
              senderType === "phone"
                ? "border-orange bg-orange-soft/40 text-navy"
                : "border-border bg-surface hover:bg-surface-secondary"
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                senderType === "phone" ? "border-orange" : "border-secondary"
              }`}
            >
              {senderType === "phone" && <span className="h-2 w-2 rounded-full bg-orange" />}
            </span>
            <div>
              <span className="block text-sm font-semibold text-navy">A phone number</span>
              <span className="text-xs text-foreground-soft">e.g. 024..., 059..., 055..., +233...</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSenderType("official")}
            className={`tap-target flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
              senderType === "official"
                ? "border-blue bg-blue-light/50 text-navy"
                : "border-border bg-surface hover:bg-surface-secondary"
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                senderType === "official" ? "border-blue" : "border-secondary"
              }`}
            >
              {senderType === "official" && <span className="h-2 w-2 rounded-full bg-blue" />}
            </span>
            <div>
              <span className="block text-sm font-semibold text-navy">Official telecom header</span>
              <span className="text-xs text-foreground-soft">e.g. "MobileMoney", "MTN", "Telecel"</span>
            </div>
          </button>
        </div>

        {senderType === "phone" && (
          <aside className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-soft p-3.5 text-sm text-red" role="alert">
            <ShieldAlert className="mt-0.5 shrink-0 text-red" size={18} aria-hidden="true" />
            <div>
              <strong className="font-semibold text-red">Critical Red Flag:</strong> Legitimate MTN MoMo and Telecel Cash alerts <em>never</em> come from a personal 10-digit phone number. If someone sent this from a normal SIM card, it is almost certainly a scam!
            </div>
          </aside>
        )}
      </div>

      {/* SAMPLE SHORTCUTS */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Or try a common MoMo scam pattern:
          </span>
          <button
            type="button"
            onClick={handlePaste}
            className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors shadow-2xs"
          >
            <ClipboardPaste size={14} aria-hidden="true" />
            Paste from clipboard
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {SAMPLE_MOMO_SCAMS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setText(sample.text);
                setSenderType("phone");
              }}
              className="tap-target inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-soft hover:border-blue hover:text-blue transition-all"
            >
              <Sparkles size={13} className="text-blue" />
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
      <div className="rounded-2xl border border-border bg-surface-secondary p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-navy">
          <CheckCircle2 size={18} className="text-green" /> Safe way to check your real balance:
        </h2>
        <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
          Never rely on SMS text messages to know if money arrived. Dial your provider's official short code directly to view your genuine statement:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="tel:*170%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-navy hover:border-orange hover:text-orange transition-colors shadow-2xs"
          >
            <PhoneCall size={14} className="text-orange" /> Dial *170# (MTN MoMo)
          </a>
          <a
            href="tel:*110%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-navy hover:border-red hover:text-red transition-colors shadow-2xs"
          >
            <PhoneCall size={14} className="text-red" /> Dial *110# (Telecel Cash)
          </a>
          <a
            href="tel:*500%23"
            className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors shadow-2xs"
          >
            <PhoneCall size={14} className="text-blue" /> Dial *500# (AT Money)
          </a>
        </div>
      </div>
    </AnalysisInputPage>
  );
}
