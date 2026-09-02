import { Camera, Link2, MessageSquare, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const PRIMARY_OPTIONS = [
  { to: "/analyze/message", icon: MessageSquare, title: "A message", body: "Paste a text, WhatsApp message, or email." },
  { to: "/analyze/image", icon: Camera, title: "A screenshot", body: "Upload a photo of what you received." },
  { to: "/analyze/url", icon: Link2, title: "A link", body: "Paste a link before you open it." },
];

export function AnalyzePage() {
  useDocumentHead({ title: "Check something", description: "Check a suspicious message, screenshot, or link with ScamLens.", path: "/analyze" });

  return (
    <main className="container-page py-10 sm:py-14">
      <Link to="/" className="tap-target inline-flex items-center text-sm font-medium text-ink-soft hover:text-pine">← Back</Link>
      <h1 className="mt-7 max-w-xl text-4xl sm:text-5xl">What did you receive?</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-soft">Pick the thing you're worried about. We'll help you decide what to do next.</p>

      <div className="mt-8 space-y-3">
        {PRIMARY_OPTIONS.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group block">
            <Card className="flex min-h-[104px] items-center gap-4 p-5 transition-colors group-hover:border-pine/30 group-hover:bg-pine-soft/40">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine-soft text-pine"><Icon aria-hidden="true" size={23} /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl">{title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{body}</span>
              </span>
              <ArrowRight aria-hidden="true" className="shrink-0 text-ink-soft" />
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-7 border-t border-ink/10 pt-6">
        <Link to="/analyze/call" className="tap-target inline-flex items-center gap-2 text-sm font-medium text-pine hover:text-pine-dark">
          <Phone aria-hidden="true" size={18} />
          Something someone told me
        </Link>
        <p className="mt-1 text-sm text-ink-soft">Describe a call or conversation that felt wrong.</p>
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] bg-pine-soft/60 p-4 text-sm text-ink-soft">
        <strong className="text-ink">Keep private information out.</strong> Never enter a password, PIN, OTP, or recovery code.
      </div>

      <Link to="/" className={buttonClasses({ variant: "quiet", className: "mt-5" })}>Back home</Link>
    </main>
  );
}
