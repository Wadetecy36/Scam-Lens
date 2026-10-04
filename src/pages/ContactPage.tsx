import { Link } from "react-router-dom";
import { ArrowLeft, Mail, AlertTriangle } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export function ContactPage() {
  useDocumentHead({
    title: "Contact us",
    description: "How to get in touch with the ScamLens team.",
    path: "/contact",
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
          <Mail aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Contact ScamLens</h1>
      </div>

      <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-foreground-soft">
        <p>
          Have questions about ScamLens, want to submit a new scam pattern you encountered in Ghana, or need technical assistance? We are here to help.
        </p>
        
        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-3">
            <Mail size={22} className="text-blue" />
            <h2 className="text-xl font-bold text-navy">Email Support</h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft">
            You can reach our engineering and trust team at:
          </p>
          <a
            href="mailto:support@scamlens.org"
            className="mt-2 inline-block text-base font-bold text-blue hover:underline"
          >
            support@scamlens.org
          </a>
          <p className="mt-1 text-xs text-secondary">
            We aim to review and respond to inquiries within 1-2 business days.
          </p>
        </section>
        
        <section className="rounded-2xl border border-orange/20 bg-orange-soft p-6 text-sm text-foreground-soft leading-relaxed">
          <div className="flex items-center gap-2.5 font-bold text-navy text-base">
            <AlertTriangle size={18} className="text-orange" />
            <h3>Emergency Notice: If you have already lost money</h3>
          </div>
          <p className="mt-2 text-sm text-foreground-soft">
            ScamLens is an automated detection software and cannot cancel transactions or recover lost funds. If money has been debited or you approved an unauthorized prompt, contact your telecom network or bank immediately:
          </p>
          <ul className="mt-3 space-y-1 font-semibold text-navy">
            <li>• MTN MoMo: Call 100 or visit a service center</li>
            <li>• Telecel Cash: Call 100 or 0800 10000</li>
            <li>• AT Money: Call 100</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
