import { Camera, Link2, MessageSquare, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const OPTIONS = [
  { to: "/analyze/message", icon: MessageSquare, title: "A message", body: "Paste a text, WhatsApp message, or email." },
  { to: "/analyze/image", icon: Camera, title: "A screenshot", body: "Upload a photo of the message or offer." },
  { to: "/analyze/url", icon: Link2, title: "A link", body: "Check a URL before you open it." },
  { to: "/analyze/call", icon: Phone, title: "Something you were told", body: "Describe a call or conversation that felt off." },
];

export function AnalyzePage() {
  useDocumentHead({ title: "Check something", description: "Choose a message, screenshot, link, or conversation to check with ScamLens.", path: "/analyze" });
  return (
    <main className="container-page py-12 sm:py-16">
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">What would you like to check?</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-soft">Choose whatever you have in front of you. ScamLens will explain the warning signs in plain language.</p>
      <div className="mt-8 space-y-3">
        {OPTIONS.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group block">
            <Card className="flex min-h-[100px] items-center gap-4 transition-colors group-hover:border-pine/30 group-hover:bg-pine-soft/40">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine-soft text-pine"><Icon aria-hidden="true" size={23} /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl">{title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{body}</span>
              </span>
              <ArrowRight aria-hidden="true" className="shrink-0 text-ink-soft transition-transform group-hover:translate-x-1" />
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-ink-soft">Never enter a password, PIN, OTP, or recovery code into ScamLens.</p>
      <Link to="/" className={buttonClasses({ variant: "quiet", className: "mt-3 w-full sm:w-auto" })}>Back home</Link>
    </main>
  );
}
