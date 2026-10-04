import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useStructuredData } from "@/hooks/useStructuredData";
import { buttonClasses } from "@/components/ui/button-classes";

export function AboutPage() {
  useDocumentHead({
    title: "About ScamLens",
    description: "Learn what ScamLens does, who it is for, and what its AI analysis can and cannot tell you.",
    path: "/about",
  });
  
  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ScamLens",
      url: "https://scam-lens-blue.vercel.app",
      description: "An AI safety check for suspicious messages, links, screenshots, and online offers in Ghana.",
    },
    "organization"
  );

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
          <ShieldCheck aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">About ScamLens</h1>
      </div>
      
      <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-foreground-soft">
        <p>
          ScamLens is an independent digital safety service built to protect everyday individuals, older adults, and small enterprise owners in Ghana from mobile money fraud and phishing.
        </p>
        
        <p>
          We know that modern financial fraud relies heavily on psychological pressure—rushing people into making mistakes before they have time to think. ScamLens gives you a calm, objective second opinion in seconds.
        </p>
        
        <div className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-2.5 text-lg font-bold text-navy">
            <CheckCircle2 size={20} className="text-green" />
            <h2>What ScamLens Does</h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft">
            We evaluate text messages, WhatsApp forwards, payment links, and screenshots against known scam patterns. We provide clear, plain-English explanations of any red flags and suggest concrete steps to verify the situation safely.
          </p>
        </div>
        
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-2.5 text-lg font-bold text-navy">
            <AlertCircle size={20} className="text-orange" />
            <h2>What ScamLens Does Not Do</h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft">
            ScamLens is a risk assessment tool, not an absolute guarantee. We cannot recover stolen funds, access your mobile wallet, or report crimes on your behalf. If you believe your funds or SIM have already been compromised, call your telecom or bank immediately.
          </p>
        </div>
      </div>

      <div className="mt-10 flex">
        <Link to="/analyze" className={buttonClasses({ size: "lg" })}>
          Check a message
        </Link>
      </div>
    </main>
  );
}
