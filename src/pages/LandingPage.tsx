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
    <main className="bg-background min-h-screen text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h1 className="text-balance font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                Not sure?
                <br />
                <span className="text-primary">Check first.</span>
              </h1>
              
              <p className="text-balance mt-6 max-w-lg text-lg text-muted-foreground sm:text-xl">
                Paste something suspicious below. ScamLens checks it for common
                scam warning signs and tells you what to look out for.
              </p>
              
              {/* QUICK TRUST SIGNALS */}
              <div className="mt-8 flex flex-col gap-4 text-base font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </div>
                  Plain-language results
                </span>
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Lock size={18} aria-hidden="true" />
                  </div>
                  No security jargon
                </span>
                <span className="inline-flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Users size={18} aria-hidden="true" />
                  </div>
                  Built for everyday people
                </span>
              </div>
            </div>

            {/* SCANNER */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="scamlens-message"
                  className="flex items-center gap-2 text-base font-bold text-foreground"
                >
                  <MessageSquare
                    size={20}
                    className="text-primary"
                    aria-hidden="true"
                  />
                  What did you receive?
                </label>

                <span className="text-sm font-semibold text-muted-foreground">
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
                className="mt-4 min-h-48 w-full resize-y rounded-lg border border-border bg-background p-4 text-base text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
                aria-describedby="scanner-privacy"
              />

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div
                  id="scanner-privacy"
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
                >
                  <Lock size={16} aria-hidden="true" />
                  No passwords, OTPs, or PINs needed.
                </div>

                <Link
                  to={analyzeHref}
                  className={buttonClasses({
                    variant: "accent",
                    size: "lg",
                    className: "w-full sm:w-auto shadow-md",
                  })}
                >
                  <Search size={18} aria-hidden="true" />
                  Analyze message
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>

              {/* EXAMPLES */}
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Try an example
                </p>

                <div className="flex flex-wrap gap-3">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.label}
                      type="button"
                      onClick={() => setMessage(example.text)}
                      className="tap-target cursor-pointer rounded-lg border-2 border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary/5"
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

      {/* VALUE PROP & FEATURES (How It Works) */}
      <section className="bg-card py-16 sm:py-24 border-y border-border">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Three steps. No security degree required.
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              We designed ScamLens to be clean, simple, and straightforward.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-3">
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
              <div key={step.number} className="group p-8 rounded-2xl bg-muted border border-transparent transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-md">
                    <step.icon size={28} aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-display font-bold text-border">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-2xl font-bold text-foreground">{step.title}</h3>

                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <Lock className="text-accent" size={32} aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">Keep sensitive information private.</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                ScamLens never needs your passwords, PINs, OTPs, or banking
                credentials to analyze a suspicious message.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <Users className="text-accent" size={32} aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">Get a second opinion.</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                When something looks serious, you can involve someone you trust.
                The decision is always yours.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <ShieldCheck className="text-accent" size={32} aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">No false certainty.</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                ScamLens is a safety check, not a guarantee. When in doubt,
                pause and verify through an official channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-16 sm:py-24 border-t border-border">
        <div className="container-reading">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Before you use ScamLens
            </h2>
          </div>

          <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
            {FAQS.map((item) => (
              <details key={item.q} className="group p-6 sm:p-8 cursor-pointer">
                <summary className="flex list-none items-center justify-between gap-6 font-display text-lg font-bold text-foreground">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={24}
                    className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-4 pr-8 text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-primary py-20 text-on-primary">
        <div className="container-page text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Ready to check a message?</h2>
          <p className="mt-6 mx-auto max-w-2xl text-xl opacity-90 leading-relaxed">
            Don't risk clicking a malicious link or giving away sensitive information.
          </p>
          <div className="mt-10">
            <Link
              to="/analyze/message"
              className={buttonClasses({
                variant: "light",
                size: "lg",
                className: "shadow-lg text-lg px-8 py-4",
              })}
            >
              Start Your Free Analysis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
