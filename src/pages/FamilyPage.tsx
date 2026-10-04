import { Users, ShieldCheck, MessageCircle, ArrowLeft, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/button-classes";

export function FamilyPage() {
  useDocumentHead({
    title: "Family safety · ScamLens",
    description: "Learn how to ask trusted family members to review suspicious messages on WhatsApp.",
    path: "/family",
  });

  const defaultFamilyPrompt =
    "Hi, I received a strange message about money/an account and wanted your second opinion before doing anything. Can you take a look?";
  const whatsAppGeneralUrl = `https://wa.me/?text=${encodeURIComponent(defaultFamilyPrompt)}`;

  return (
    <main className="container-page py-10 sm:py-14">
      <Link
        to="/analyze"
        className="tap-target inline-flex items-center gap-2 text-base font-medium text-foreground-soft hover:text-primary"
      >
        <ArrowLeft size={17} /> Back to check
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <Users aria-hidden="true" className="text-primary" size={32} />
        <h1 className="font-heading text-4xl">A second pair of eyes</h1>
      </div>
      <p className="mt-4 text-lg text-foreground-soft max-w-xl">
        Scammers succeed when they make people feel isolated and rushed. In Ghana, older parents and market traders protect themselves best by pausing to ask a trusted son, daughter, or close friend.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6 border-border/20">
          <MessageCircle className="text-emerald-600" size={28} />
          <h2 className="mt-3 font-heading text-xl">Ask on WhatsApp right now</h2>
          <p className="mt-2 text-sm text-foreground-soft leading-relaxed">
            Tap the button below to open WhatsApp with a ready-made message. You can send it to your son, daughter, or trusted friend to get their advice.
          </p>
          <a
            href={whatsAppGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({
              className: "mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700",
            })}
          >
            <MessageCircle size={18} /> Ask someone on WhatsApp
          </a>
        </Card>

        <Card className="p-6 border-border/20">
          <ShieldCheck className="text-primary" size={28} />
          <h2 className="mt-3 font-heading text-xl">How family can help</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground-soft">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">•</span>
              <span>They can call the bank or company on the official line to confirm.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">•</span>
              <span>They can verify if a Mobile Money reversal alert or SMS is fake.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">•</span>
              <span>They can inspect links before you tap or enter your PIN.</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] bg-amber-500/10 border border-amber-300/30 p-5 text-sm text-foreground-soft">
        <strong className="text-foreground">Golden Rule for Ghanaian Families:</strong> Never feel ashamed or embarrassed to ask. Real banks and telecom providers will never threaten you or rush you if you tell them: <em>"Let me speak with my daughter first."</em>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/analyze/momo" className={buttonClasses({ className: "inline-flex items-center gap-2" })}>
          <PhoneCall size={16} /> Verify a MoMo SMS
        </Link>
        <Link to="/analyze" className={buttonClasses({ variant: "secondary", className: "inline-flex" })}>
          Check a message
        </Link>
      </div>
    </main>
  );
}
