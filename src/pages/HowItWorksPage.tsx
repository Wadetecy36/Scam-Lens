import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, MessageSquare, CheckCircle2 } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { buttonClasses } from "@/components/ui/button-classes";

export function HowItWorksPage() {
  useDocumentHead({
    title: "How it works",
    description: "Learn how ScamLens checks messages, links, and pictures for signs of fraud.",
    path: "/how-it-works",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <div className="mt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-light px-3.5 py-1 text-xs font-semibold text-blue mb-3">
          Verification Process
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">How ScamLens Works</h1>
        <p className="mt-3 text-base sm:text-lg text-foreground-soft leading-relaxed">
          ScamLens provides a fast second opinion to protect you from financial fraud and identity theft.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-icon-bg text-blue">
              <MessageSquare size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">1. You share the suspicious item</h2>
              <p className="mt-2 text-base text-foreground-soft leading-relaxed">
                You can type or paste a text message, WhatsApp conversation, website link, or upload a screenshot of an alert or receipt. Never include secret PINs, passwords, or recovery codes.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-soft text-purple">
              <Zap size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">2. We scan for known scam tactics</h2>
              <p className="mt-2 text-base text-foreground-soft leading-relaxed">
                Our analysis engine evaluates urgency pressure, impersonation markers, fake MoMo reversal signatures, SIM swap threats, and cross-references URLs with global threat intelligence databases.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
              <ShieldCheck size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">3. We explain the risk in plain English</h2>
              <p className="mt-2 text-base text-foreground-soft leading-relaxed">
                We assign a clear risk level (LOW, CAUTION, SUSPICIOUS, or HIGH) and break down exactly why it was flagged so you understand the specific tricks being attempted.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-navy-dark">
              <CheckCircle2 size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">4. You take safe, verified steps</h2>
              <p className="mt-2 text-base text-foreground-soft leading-relaxed">
                We provide a direct checklist of what to do and what to avoid, including official telecom shortcodes (*170#, *110#, *500#) so you can verify your actual account balance directly.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 flex">
        <Link to="/analyze" className={buttonClasses({ size: "lg" })}>
          Check a message now
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
