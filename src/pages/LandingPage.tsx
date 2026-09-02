import { Link } from "react-router-dom";
import { MessageSquare, Camera, Link2, Phone, ShieldCheck, Users, Lock } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { RiskPill } from "@/components/risk/RiskPill";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useStructuredData } from "@/hooks/useStructuredData";

const INPUT_CARDS = [
  { icon: MessageSquare, title: "A message", body: "Paste a text, WhatsApp, or email you're unsure about." },
  { icon: Camera, title: "A screenshot", body: "Upload a photo of a suspicious message or offer." },
  { icon: Link2, title: "A link", body: "Check a URL before you tap it." },
  { icon: Phone, title: "Something you were told", body: "Describe a call or conversation that felt off." },
];

const FAQS = [
  {
    q: "Can ScamLens guarantee something is safe?",
    a: "No. ScamLens looks for common warning signs and explains what it finds, but it can't confirm anything is completely legitimate. Use it alongside your own judgment.",
  },
  {
    q: "Does ScamLens store what I paste in?",
    a: "Saved history contains only lightweight result metadata when you choose to save a result. Your original message or screenshot is not written to that history.",
  },
  {
    q: "Do I need a family member to use this?",
    a: "No. Asking a trusted family member to review a result is entirely optional — ScamLens works on its own.",
  },
];

export function LandingPage() {
  useDocumentHead({
    title: "Before you click, check",
    description: "ScamLens is an AI safety check for suspicious messages, links, screenshots, and online offers — built for parents and anyone who wants a second opinion before they act.",
    path: "/",
  });
  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScamLens",
      url: "https://scamlens.example.com",
      description: "An AI safety check for suspicious messages, links, and online offers.",
    },
    "website",
  );

  return (
    <div>
      {/* Hero */}
      <section className="container-page pb-10 pt-12 sm:pt-16">
        <p className="font-display text-4xl leading-[1.08] sm:text-5xl">
          Before you click, <span className="text-pine">check.</span>
        </p>
        <p className="mt-4 max-w-md text-lg text-ink-soft">
          Use AI to check suspicious messages, links, screenshots, and online requests before you act on them.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/analyze" className={buttonClasses({ size: "lg" })}>
            Check something
          </Link>
          <a href="#how-it-works" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            How it works
          </a>
        </div>

        {/* Live-feeling product preview — the hero visual */}
        <div className="mt-10 animate-settle rounded-[var(--radius-card)] border border-ink/10 bg-white/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Example message</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
            "Your bank account will be blocked today. Verify your account immediately using this link: bit.ly/4kzX..."
          </p>
          <div className="mt-4 flex items-center justify-between">
            <RiskPill level="HIGH" score={88} />
            <span className="text-xs text-ink-soft">Example result</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="hairline container-page py-12">
        <h2 className="font-display text-2xl">How ScamLens works</h2>
        <ol className="mt-6 space-y-5">
          {[
            ["Share what's worrying you", "Paste a message, upload a screenshot, or describe a call."],
            ["ScamLens checks it", "We look for the patterns real scams use, and explain what we find."],
            ["You decide, with a clear picture", "Get a risk level, plain-language reasons, and exactly what to do next."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-soft font-display text-pine-dark">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-[0.95rem] text-ink-soft">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What you can check */}
      <section className="hairline container-page py-12">
        <h2 className="font-display text-2xl">What you can check</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {INPUT_CARDS.map((card) => (
            <div key={card.title} className="rounded-[var(--radius-card)] border border-ink/10 bg-white/50 p-4">
              <card.icon aria-hidden="true" size={20} className="text-pine" />
              <p className="mt-2.5 text-sm font-medium">{card.title}</p>
              <p className="mt-1 text-xs leading-snug text-ink-soft">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parent-friendly safety */}
      <section className="hairline container-page py-12">
        <ShieldCheck aria-hidden="true" size={24} className="text-pine" />
        <h2 className="mt-3 font-display text-2xl">Made for people, not security experts</h2>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          No jargon, no alarming dashboards. Every result tells you plainly what happened, why it looks suspicious,
          and what to do — in language built for someone checking this on their phone, not a technical report.
        </p>
      </section>

      {/* Trusted family member */}
      <section className="hairline container-page py-12">
        <Users aria-hidden="true" size={24} className="text-pine" />
        <h2 className="mt-3 font-display text-2xl">Ask a trusted family member</h2>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          On a high-risk result, you can optionally ask someone you trust to take a look with you. It's there if you
          want it — ScamLens never requires another person to give you an answer.
        </p>
      </section>

      {/* Privacy */}
      <section className="hairline container-page py-12">
        <Lock aria-hidden="true" size={24} className="text-pine" />
        <h2 className="mt-3 font-display text-2xl">Your information stays yours</h2>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          ScamLens never asks for your passwords, OTPs, or PINs. What you paste in is used only to produce your
          result, and isn't kept afterward unless you choose to save it to your history.
        </p>
      </section>

      {/* FAQ */}
      <section className="hairline container-page py-12">
        <h2 className="font-display text-2xl">Questions people ask</h2>
        <div className="mt-6 space-y-5">
          {FAQS.map((item) => (
            <div key={item.q}>
              <p className="font-medium">{item.q}</p>
              <p className="mt-1 text-[0.95rem] text-ink-soft">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-16 pt-4">
        <div className="rounded-[var(--radius-card)] bg-pine px-6 py-8 text-paper">
          <p className="font-display text-2xl">Got a message you're not sure about?</p>
          <p className="mt-2 text-paper/80">It takes less than a minute to check.</p>
          <Link
            to="/analyze"
            className={buttonClasses({
              variant: "secondary",
              size: "lg",
              className: "mt-5 border-paper/40 bg-paper text-pine hover:bg-paper/90",
            })}
          >
            Check something
          </Link>
        </div>
      </section>
    </div>
  );
}
