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
    label: "Fake MoMo Reversal",
    text: "Payment received for GHS 500.00 from KWAME ASANTE. Current Balance: GHS 520.00. Reference: 2948201938. Please refund mistakenly sent funds immediately.",
  },
  {
    label: "Bank warning",
    text: "Your bank account will be blocked today due to Ghana Card verification failure. Verify your credentials immediately using this link.",
  },
  {
    label: "Prize lottery",
    text: "Congratulations! You have won a cash prize of GHS 10,000 in the promo draw. Pay the processing fee of GHS 150 to claim your winnings.",
  },
  {
    label: "Urgent package",
    text: "Your delivery package is waiting at customs. Pay the small clearance fee today to avoid returning the package to sender.",
  },
];

const FAQS = [
  {
    q: "Can ScamLens guarantee that something is completely safe?",
    a: "No. ScamLens looks for known scam patterns, manipulative pressure, and suspicious links. A low-risk result means no obvious red flags were spotted, but you should always stay cautious.",
  },
  {
    q: "What information should I never share?",
    a: "Never enter or give anyone your Mobile Money PIN, banking passwords, one-time SMS verification codes (OTP), or Ghana Card PIN numbers. Legitimate banks and telecoms will never ask for them.",
  },
  {
    q: "Does ScamLens store my private messages?",
    a: "No. ScamLens only saves lightweight result scores on your local device if you explicitly choose to click 'Save result'. Your original messages are not permanently stored.",
  },
  {
    q: "Do I need technical skills to use this?",
    a: "Not at all. ScamLens is designed for parents, elders, market vendors, and students. Everything is explained in clear, plain language with direct advice on what to do.",
  },
];

export function LandingPage() {
  const [message, setMessage] = useState("");

  useDocumentHead({
    title: "Before you click, check",
    description:
      "ScamLens checks suspicious messages, screenshots, links, calls, and online offers for common scam warning signs in Ghana.",
    path: "/",
  });

  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScamLens",
      url: "https://scam-lens-blue.vercel.app",
      description:
        "An AI and threat-intelligence safety check for suspicious messages, links, screenshots, and MoMo transfers.",
    },
    "website",
  );

  const analyzeHref = message.trim()
    ? `/analyze/message?text=${encodeURIComponent(message.trim())}`
    : "/analyze/message";

  return (
    <main className="bg-surface min-h-screen text-navy font-sans">
      {/* HERO SECTION */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-light px-3.5 py-1 text-xs font-semibold text-blue">
                <ShieldCheck size={14} aria-hidden="true" />
                <span>Financial & Digital Safety for Ghana</span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.12]">
                Before you click, <br />
                <span className="text-blue">check first.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-foreground-soft">
                Paste any suspicious text, WhatsApp message, MoMo alert, or link. ScamLens analyzes it in seconds and explains in plain language whether it is safe.
              </p>

              {/* QUICK TRUST SIGNALS */}
              <div className="mt-8 flex flex-col gap-3.5 text-sm font-semibold text-foreground-soft">
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-icon-bg text-blue">
                    <ShieldCheck size={16} aria-hidden="true" />
                  </div>
                  Plain-language advice — no security jargon
                </span>
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Lock size={16} aria-hidden="true" />
                  </div>
                  Zero passwords, PINs, or OTPs required
                </span>
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-soft text-purple">
                    <Users size={16} aria-hidden="true" />
                  </div>
                  Built for elders, families & small businesses
                </span>
              </div>
            </div>

            {/* LIVE MESSAGE SCANNER CARD */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="scamlens-message"
                    className="flex items-center gap-2 text-sm font-bold text-navy"
                  >
                    <MessageSquare size={18} className="text-blue" aria-hidden="true" />
                    What did you receive?
                  </label>

                  <span className="text-xs font-semibold text-secondary">
                    {message.length}/3000
                  </span>
                </div>

                <textarea
                  id="scamlens-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 3000))}
                  placeholder="Paste a suspicious SMS, WhatsApp message, email, or offer here..."
                  className="mt-3.5 min-h-[140px] w-full resize-y rounded-xl border border-border bg-surface p-4 text-base text-navy outline-none transition-all placeholder:text-secondary focus:border-blue focus:ring-4 focus:ring-blue/10"
                  aria-describedby="scanner-privacy"
                />

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    id="scanner-privacy"
                    className="flex items-center gap-1.5 text-xs font-medium text-secondary"
                  >
                    <Lock size={14} aria-hidden="true" />
                    Never enter private PINs or passwords.
                  </div>

                  <Link
                    to={analyzeHref}
                    className={buttonClasses({
                      size: "lg",
                      className: "w-full sm:w-auto",
                    })}
                  >
                    <Search size={16} aria-hidden="true" />
                    Analyze now
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>

                {/* EXAMPLES */}
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
                    Try a common scam example:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example.label}
                        type="button"
                        onClick={() => setMessage(example.text)}
                        className="tap-target cursor-pointer rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground-soft transition-all hover:border-blue hover:text-blue hover:bg-blue-light/40"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE STEPS SECTION */}
      <section className="bg-surface-secondary py-16 sm:py-20 border-y border-border">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">
              Three steps. No tech degree required.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-foreground-soft leading-relaxed">
              ScamLens is built to be fast, clear, and reassuring.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: MessageSquare,
                title: "Share it",
                body: "Paste a text, screenshot a receipt, check a web link, or describe a suspicious call.",
              },
              {
                number: "02",
                icon: Zap,
                title: "We analyze it",
                body: "ScamLens compares it against thousands of known fraud patterns and threat databases.",
              },
              {
                number: "03",
                icon: ShieldCheck,
                title: "You stay safe",
                body: "Receive a clear risk assessment, warning signs, and official dial codes to verify safely.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-border bg-white p-7 transition-all hover:border-blue hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
                    <step.icon size={24} aria-hidden="true" />
                  </div>
                  <span className="text-2xl font-bold text-border group-hover:text-blue transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-navy">{step.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR / GHANA COMMUNITY */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <img
                src="/images/hero.jpg"
                alt="Ghanaian mother checking her phone safely"
                className="rounded-2xl border border-border w-full h-auto object-cover max-h-[280px] shadow-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/family.jpg"
                  alt="Younger relative helping an older adult"
                  className="rounded-2xl border border-border w-full h-auto object-cover max-h-[180px] shadow-sm"
                />
                <img
                  src="/images/business.jpg"
                  alt="Market trader checking mobile transactions"
                  className="rounded-2xl border border-border w-full h-auto object-cover max-h-[180px] shadow-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green-soft px-3 py-1 text-xs font-semibold text-green mb-4">
                Designed for everyday life
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">
                Built for real Ghanaian communities.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-soft leading-relaxed">
                Whether you are a parent receiving a stressful WhatsApp plea, a market trader verifying a customer's MoMo alert, or helping your grandparents avoid SIM swap traps—ScamLens gives you calm, clear answers.
              </p>

              <ul className="mt-6 space-y-3.5 text-base font-semibold text-navy">
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-icon-bg text-blue">
                    <Zap size={14} aria-hidden="true" />
                  </div>
                  No technical jargon or confusing security terms
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-icon-bg text-blue">
                    <Zap size={14} aria-hidden="true" />
                  </div>
                  Official USSD shortcuts (*170#, *110#, *500#)
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-icon-bg text-blue">
                    <Zap size={14} aria-hidden="true" />
                  </div>
                  Lightweight and ultra-fast on mobile 3G/4G connections
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SAFETY PILLARS */}
      <section className="bg-surface-secondary py-16 sm:py-20 border-t border-border">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-7 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
                <Lock size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">Keep sensitive data private.</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                ScamLens never needs your passwords, PINs, OTPs, or banking credentials to analyze a suspicious message.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-soft text-purple">
                <Users size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">Get a family second opinion.</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                When something looks serious, forward the report to someone you trust on WhatsApp with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-soft text-green">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">No false certainty.</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                ScamLens is a safety check, not a guarantee. When in doubt, pause and verify through official channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-foreground-soft">
              Everything you need to know about checking messages safely.
            </p>
          </div>

          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white shadow-2xs">
            {FAQS.map((item) => (
              <details key={item.q} className="group p-6 cursor-pointer">
                <summary className="flex list-none items-center justify-between gap-4 text-base font-bold text-navy">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-secondary transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 pr-6 text-sm leading-relaxed text-foreground-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-navy py-16 sm:py-20 text-white">
        <div className="container-page text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to check a message?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
            Never risk clicking an unknown link or losing money to a fake reversal. Check it in seconds with ScamLens.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/analyze"
              className={buttonClasses({
                size: "lg",
                className: "bg-blue hover:bg-navy-dark text-white font-bold px-8 py-3.5 text-base shadow-md",
              })}
            >
              Start free check
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
