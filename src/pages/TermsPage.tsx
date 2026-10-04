import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export function TermsPage() {
  useDocumentHead({
    title: "Terms of service",
    description: "The rules for using ScamLens.",
    path: "/terms",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <div className="mt-8 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
          <FileText aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Terms of Service</h1>
      </div>
      
      <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-foreground-soft">
        <p>
          By using ScamLens, you agree to these clear guidelines.
        </p>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">Second Opinion Only</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            ScamLens is an automated informational guide designed to help identify known scam patterns. It is not an absolute financial or legal guarantee. A low-risk result does not guarantee complete legitimacy, and you should always confirm financial transfers through official channels.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">User Responsibility</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            You remain responsible for your own financial transactions, payments, and account security. When in doubt, dial your telecom's official short code (*170#, *110#, *500#) or visit a local branch.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">No Confidential Credentials</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            You agree never to submit sensitive passwords, PINs, or security answers to ScamLens.
          </p>
        </section>
      </div>
    </main>
  );
}
