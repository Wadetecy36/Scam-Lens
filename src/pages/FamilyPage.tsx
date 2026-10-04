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
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back to check
      </Link>

      <div className="mt-8 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
          <Users aria-hidden="true" size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">A second pair of eyes</h1>
      </div>
      <p className="mt-4 text-base sm:text-lg text-foreground-soft max-w-xl leading-relaxed">
        Scammers succeed when they make people feel isolated and rushed. In Ghana, older parents and market traders protect themselves best by pausing to ask a trusted son, daughter, or close friend.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6 sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-soft text-green">
            <MessageCircle size={26} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-navy">Ask on WhatsApp right now</h2>
          <p className="mt-2 text-sm text-foreground-soft leading-relaxed">
            Tap the button below to open WhatsApp with a ready-made message. You can send it to your son, daughter, or trusted friend to get their advice immediately.
          </p>
          <a
            href={whatsAppGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target mt-5 inline-flex items-center gap-2 rounded-xl bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green/90 transition-colors shadow-2xs"
          >
            <MessageCircle size={18} /> Ask someone on WhatsApp
          </a>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
            <ShieldCheck size={26} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-navy">How family can help</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground-soft leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue" />
              <span>They can call the bank or company on the official line to confirm.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue" />
              <span>They can verify if a Mobile Money reversal alert or SMS is fake.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue" />
              <span>They can inspect links before you tap or enter your PIN.</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-orange/20 bg-orange-soft p-5 text-sm text-foreground-soft leading-relaxed">
        <strong className="font-bold text-navy">Golden Rule for Ghanaian Families:</strong> Never feel ashamed or embarrassed to ask. Real banks and telecom providers will never threaten you or rush you if you tell them: <em>"Let me speak with my daughter first."</em>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
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
