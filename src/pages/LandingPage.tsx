import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Lock,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useStructuredData } from "@/hooks/useStructuredData";

const EXAMPLES = [
  {
    label: "Bank warning",
    text: "Your bank account will be blocked today. Verify your account immediately using this link.",
  },
  {
    label: "Prize",
    text: "Congratulations! You have won a cash prize. Pay the processing fee to claim your winnings.",
  },
  {
    label: "Investment",
    text: "Invest $500 today and receive guaranteed profit within 24 hours. Risk-free investment.",
  },
  {
    label: "Delivery",
    text: "Your package is waiting. Pay the small delivery fee today to avoid returning the package.",
  },
];

const FAQS = [
  {
    q: "Can ScamLens guarantee that something is safe?",
    a: "No. ScamLens looks for common warning signs and explains what it finds. A low-risk result is not a guarantee that something is legitimate.",
  },
  {
    q: "What should I never share?",
    a: "Never give anyone your password, PIN, OTP, banking credentials, recovery code, or other sensitive security information just because a message asks for it.",
  },
  {
    q: "Does ScamLens store my messages?",
    a: "Saved history contains lightweight result information. Your original message or screenshot is not written to your saved history.",
  },
  {
    q: "Do I need someone else to use ScamLens?",
    a: "No. You can use ScamLens completely on your own. You can also choose to involve someone you trust when you want a second opinion.",
  },
];

export function LandingPage() {
  const [message, setMessage] = useState("");

  useDocumentHead({
    title: "Before you click, check",
    description:
      "ScamLens checks suspicious messages, screenshots, links, calls, and online offers for common scam warning signs.",
    path: "/",
  });

  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScamLens",
      url: "https://scamlens.example.com",
      description:
        "An AI safety check for suspicious messages, links, screenshots, calls, and online offers.",
    },
    "website",
  );

  const analyzeHref = message.trim()
    ? `/analyze/message?text=${encodeURIComponent(message.trim())}`
    : "/analyze/message";

  return (
    <main>
      {/* HERO */}
      <section className="bg-paper py-12 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <h1 className="text-balance font-display text-4xl sm:text-5xl lg:text-6xl">
                Not sure?
                <br />
                <span className="text-pine">Check first.</span>
              </h1>
              
              <p className="text-balance mt-5 max-w-lg text-lg text-ink-soft sm:text-xl">
                Paste something suspicious below. ScamLens checks it for common
                scam warning signs and tells you what to look out for.
              </p>
              
              {/* QUICK TRUST SIGNALS */}
              <div className="mt-8 flex flex-col gap-3 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pine/10 text-pine">
                    <ShieldCheck size={14} aria-hidden="true" />
                  </div>
                  Plain-language results
                </span>
                <span className="inline-flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pine/10 text-pine">
                    <ShieldCheck size={14} aria-hidden="true" />
                  </div>
                  No security jargon
                </span>
                <span className="inline-flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pine/10 text-pine">
                    <ShieldCheck size={14} aria-hidden="true" />
                  </div>
                  Built for everyday people
                </span>
              </div>
            </div>

            {/* SCANNER */}
            <div>
              <div className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="scamlens-message"
                    className="flex items-center gap-2 text-sm font-semibold"
                  >
                    <MessageSquare
                      size={17}
                      className="text-pine"
                      aria-hidden="true"
                    />
                    What did you receive?
                  </label>

                  <span className="text-xs text-ink-muted">
                    {message.length}/3000
                  </span>
                </div>

                <textarea
                  id="scamlens-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value.slice(0, 3000))
                  }
                  placeholder="Paste a suspicious message, email, or offer here..."
                  className="mt-3 min-h-40 w-full resize-y rounded-xl border border-ink/10 bg-paper-dim p-4 text-base text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-pine/40 focus:bg-white focus:ring-4 focus:ring-pine/10 sm:min-h-44"
                  aria-describedby="scanner-privacy"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    id="scanner-privacy"
                    className="flex items-center gap-2 text-xs text-ink-muted"
                  >
                    <Lock size={14} aria-hidden="true" />
                    No passwords, OTPs, or PINs needed.
                  </div>

                  <Link
                    to={analyzeHref}
                    className={buttonClasses({
                      size: "lg",
                      className: "w-full sm:w-auto",
                    })}
                  >
                    <Search size={18} aria-hidden="true" />
                    Analyze message
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* EXAMPLES */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  Try an example
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.label}
                      type="button"
                      onClick={() => setMessage(example.text)}
                      className="tap-target rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-sm transition hover:border-pine/20 hover:text-pine"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-pine text-paper">
        <div className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper/60">
              Simple by design
            </p>
            <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
              Three steps. No security degree required.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: MessageSquare,
                title: "Share it",
                body: "Paste a message, upload a screenshot, check a link, or describe a call.",
              },
              {
                number: "02",
                icon: Zap,
                title: "We analyze it",
                body: "ScamLens checks for patterns associated with common scam tactics.",
              },
              {
                number: "03",
                icon: ShieldCheck,
                title: "You decide",
                body: "Get a clear risk level, reasons, and practical next steps.",
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="text-sm font-bold text-paper/40">
                  {step.number}
                </div>

                <step.icon
                  size={23}
                  className="mt-5 text-paper"
                  aria-hidden="true"
                />

                <h3 className="mt-4 font-display text-2xl text-paper">{step.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-paper/70">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
            <Lock className="text-pine" size={23} aria-hidden="true" />
            <h3 className="mt-5 font-display text-2xl">Keep sensitive information private.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              ScamLens never needs your passwords, PINs, OTPs, or banking
              credentials to analyze a suspicious message.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
            <Users className="text-pine" size={23} aria-hidden="true" />
            <h3 className="mt-5 font-display text-2xl">Get a second opinion.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              When something looks serious, you can involve someone you trust.
              The decision is always yours.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
            <ShieldCheck className="text-pine" size={23} aria-hidden="true" />
            <h3 className="mt-5 font-display text-2xl">No false certainty.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              ScamLens is a safety check, not a guarantee. When in doubt,
              pause and verify through an official channel.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/10 bg-paper-dim">
        <div className="container-reading py-16 sm:py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pine">
              Questions
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Before you use ScamLens
            </h2>
          </div>

          <div className="mt-10 divide-y divide-ink/10 rounded-[var(--radius-card)] border border-ink/10 bg-white">
            {FAQS.map((item) => (
              <details key={item.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-ink-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 pr-7 text-sm leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
