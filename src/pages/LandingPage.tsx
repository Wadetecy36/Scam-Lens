import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Link2,
  Lock,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { RiskPill } from "@/components/risk/RiskPill";
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

const CHECK_TYPES = [
  {
    icon: MessageSquare,
    title: "Messages",
    body: "WhatsApp, SMS, email, DMs and more.",
    href: "/analyze/message",
  },
  {
    icon: Camera,
    title: "Screenshots",
    body: "Upload a screenshot and check what's being said.",
    href: "/analyze/image",
  },
  {
    icon: Link2,
    title: "Links",
    body: "Check suspicious URLs before opening them.",
    href: "/analyze/url",
  },
  {
    icon: Phone,
    title: "Calls",
    body: "Describe what someone told you over the phone.",
    href: "/analyze/call",
  },
];

const SIGNALS = [
  "Urgency and pressure",
  "Threats and intimidation",
  "Requests for money",
  "Requests for passwords or codes",
  "Suspicious links",
  "Fake rewards and prizes",
  "Impersonation",
  "Too-good-to-be-true offers",
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
      <section className="relative overflow-hidden">
        <div className="grid-paper absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-[-8rem] h-80 w-80 -translate-x-1/2 rounded-full bg-pine-soft/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-settle inline-flex items-center gap-2 rounded-full border border-pine/10 bg-white/80 px-3.5 py-2 text-xs font-semibold text-pine shadow-sm">
              <ShieldCheck size={15} aria-hidden="true" />
              A calmer way to check suspicious messages
            </div>

            <h1 className="text-balance mt-7 text-5xl sm:text-6xl lg:text-7xl">
              Not sure?
              <br />
              <span className="text-pine">Check first.</span>
            </h1>

            <p className="text-balance mx-auto mt-5 max-w-2xl text-lg text-ink-soft sm:text-xl">
              Paste something suspicious below. ScamLens checks it for common
              scam warning signs and tells you what to look out for.
            </p>
          </div>

          {/* SCANNER */}
          <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
            <div className="soft-shadow animate-settle rounded-[1.5rem] border border-ink/10 bg-white p-3 sm:p-4">
              <div className="rounded-[1.15rem] border border-ink/10 bg-paper/70 p-4 sm:p-5">
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
                  className="mt-3 min-h-40 w-full resize-y rounded-xl border border-ink/10 bg-white p-4 text-base text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-pine/40 focus:ring-4 focus:ring-pine/10 sm:min-h-44"
                  aria-describedby="scanner-privacy"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            </div>

            {/* EXAMPLES */}
            <div className="mt-5">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Try an example
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setMessage(example.text)}
                    className="tap-target rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:border-pine/20 hover:text-pine"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK TRUST SIGNALS */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-pine" aria-hidden="true" />
              Plain-language results
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-pine" aria-hidden="true" />
              No security jargon
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-pine" aria-hidden="true" />
              Built for everyday people
            </span>
          </div>
        </div>
      </section>

      {/* WHAT IT CHECKS */}
      <section className="border-y border-ink/10 bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pine">
              What can I check?
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              More than just messages.
            </h2>
            <p className="mt-4 text-ink-soft">
              ScamLens gives you several ways to investigate something that
              doesn't feel right.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHECK_TYPES.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group rounded-[var(--radius-card)] border border-ink/10 bg-paper/60 p-5 transition hover:-translate-y-1 hover:border-pine/20 hover:bg-pine-pale"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-soft text-pine">
                  <item.icon size={21} aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-xl">{item.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-pine">
                  Check it
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNALS */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-soft text-pine">
              <Sparkles size={22} aria-hidden="true" />
            </div>

            <h2 className="mt-6 text-3xl sm:text-4xl">
              We look for the patterns scammers use.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Scam messages often try to make you act before you have time to
              think. ScamLens looks for those patterns and turns them into
              understandable warning signs.
            </p>

            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-pine hover:text-pine-dark"
            >
              Learn how ScamLens works
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SIGNALS.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-soft text-pine">
                  <Check size={16} aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">{signal}</span>
              </div>
            ))}
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
            <h2 className="mt-3 text-3xl text-paper sm:text-4xl">
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

                <h3 className="mt-4 text-2xl text-paper">{step.title}</h3>

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
            <h3 className="mt-5 text-2xl">Keep sensitive information private.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              ScamLens never needs your passwords, PINs, OTPs, or banking
              credentials to analyze a suspicious message.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
            <Users className="text-pine" size={23} aria-hidden="true" />
            <h3 className="mt-5 text-2xl">Get a second opinion.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              When something looks serious, you can involve someone you trust.
              The decision is always yours.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
            <ShieldCheck className="text-pine" size={23} aria-hidden="true" />
            <h3 className="mt-5 text-2xl">No false certainty.</h3>
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
            <h2 className="mt-3 text-3xl sm:text-4xl">
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

      {/* FINAL CTA */}
      <section className="container-page py-12 sm:py-20">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-pine px-6 py-12 text-center sm:px-10 sm:py-16">
          <div
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl">
            <RiskPill level="HIGH" score={88} />

            <h2 className="mt-5 text-3xl text-paper sm:text-4xl">
              Something feels off?
              <br />
              Check it before you act.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-paper/70">
              A quick second opinion can be the difference between spotting a
              scam and clicking too soon.
            </p>

            <Link
              to="/analyze"
              className={buttonClasses({
                variant: "light",
                size: "lg",
                className: "mt-7",
              })}
            >
              <Search size={18} aria-hidden="true" />
              Check something
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
