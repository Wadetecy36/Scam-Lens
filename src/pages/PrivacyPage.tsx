import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export function PrivacyPage() {
  useDocumentHead({
    title: "Privacy policy",
    description: "How ScamLens handles your information and keeps you safe.",
    path: "/privacy",
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
          <Lock aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Privacy Policy</h1>
      </div>
      
      <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-foreground-soft">
        <p>
          We believe financial security tools must operate on a privacy-first principle. We minimize data collection and never monetize or sell personal details.
        </p>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">Ephemeral Message Processing</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            When you submit a text, message, or screenshot for scanning, it is processed strictly to generate your risk report and actionable advice. We do not maintain permanent user accounts, advertising profiles, or logs linking your identity to analyzed messages.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">Local Device History Only</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            If you click "Save result", only the risk level, category name, and timestamp are stored in your browser's local memory (localStorage). Your original message content or uploaded images are discarded from memory and never stored in history.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <h2 className="text-xl font-bold text-navy">Keep Yourself Safe</h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
            Never paste secret PINs, bank passwords, or one-time SMS verification codes into ScamLens or any online tool. ScamLens will never ask for them.
          </p>
        </section>
      </div>
    </main>
  );
}
