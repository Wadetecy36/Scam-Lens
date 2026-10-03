import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, Bookmark, BookmarkCheck, ChevronDown, ShieldCheck } from "lucide-react";
import { RiskHeader } from "@/components/risk/RiskPill";
import { Checklist } from "@/components/ui/Checklist";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/button-classes";
import { Alert } from "@/components/ui/Alert";
import { ReadAloudButton } from "@/components/voice/ReadAloudButton";
import { getResult } from "@/lib/result-store";
import { listHistory, saveToHistory } from "@/services/history-service";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { track } from "@/lib/analytics";

export function ResultPage() {
  const { id } = useParams();
  const result = id ? getResult(id) : undefined;
  useDocumentHead({ title: result ? "Your ScamLens result" : "Result unavailable", description: result ? "See what ScamLens recommends you do next." : "This ScamLens result is no longer available in this session.", path: `/result/${id ?? "unknown"}`, index: false });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState(() => !!id && listHistory().some((entry) => entry.id === id));
  if (!result) {
    return <main className="container-page py-14"><Alert tone="warning" title="This result is no longer available.">Results are kept in this session only. If you refreshed the page, check it again to create a new result.</Alert><Link to="/analyze" className={buttonClasses({ className: "mt-5 inline-flex" })}>Check something</Link></main>;
  }

  const { analysis } = result;
  const topAction = analysis.recommendedActions[0] ?? "Don't click, reply, or send money until you've verified it.";

  function save() {
    saveToHistory(analysis);
    setSaved(true);
    track("result_saved", { riskLevel: analysis.riskLevel });
  }

  return (
    <main className="container-page py-8 sm:py-12">
      <Link to="/analyze" className="tap-target inline-flex items-center gap-2 text-sm font-medium text-foreground-soft hover:text-primary"><ArrowLeft aria-hidden="true" size={17} /> Check another</Link>

      <div className="mt-6">
        <RiskHeader level={analysis.riskLevel} score={analysis.riskScore} showScale={false} />
      </div>

      <section className="mt-8 rounded-[var(--radius-card)] border border-border/10 bg-white/60 p-5 sm:p-6" aria-labelledby="action-heading">
        <div className="flex items-start gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={24} />
          <div>
            <h1 id="action-heading" className="font-heading text-2xl">What should I do?</h1>
            <p className="mt-2 text-lg leading-relaxed">{topAction}</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-2xl">Why we think that</h2>
        <p className="mt-3 text-[1.02rem] leading-relaxed text-foreground-soft">{analysis.explanations.simple || analysis.summary}</p>
        <ul className="mt-5 space-y-3">
          {analysis.warningSigns.map((sign) => (
            <li key={`${sign.type}-${sign.explanation}`} className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <div><p className="font-medium capitalize">{sign.type.replaceAll("_", " ")}</p><p className="mt-0.5 text-sm text-foreground-soft">{sign.explanation}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-border/10 pt-7">
        <button type="button" onClick={() => setDetailsOpen((open) => !open)} className="tap-target flex w-full items-center justify-between gap-4 text-left">
          <span><span className="block font-heading text-xl">Want more detail?</span><span className="text-sm text-foreground-soft">See the fuller explanation and technical information.</span></span>
          <ChevronDown aria-hidden="true" size={22} className={detailsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
        {detailsOpen && (
          <div className="mt-4 rounded-[var(--radius-card)] bg-foreground/5 p-5">
            <p className="leading-relaxed text-foreground-soft">{analysis.explanations.technical}</p>
            <p className="mt-4 text-sm text-foreground-soft">Risk score: <strong className="text-foreground">{Math.round(analysis.riskScore)}/100</strong> · Confidence: <strong className="text-foreground">{Math.round(analysis.confidence * 100)}%</strong></p>
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-8 sm:grid-cols-2">
        <Checklist title="What to do" items={analysis.recommendedActions} tone="do" />
        <Checklist title="What not to do" items={analysis.avoidActions} tone="avoid" />
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <ReadAloudButton text={analysis.explanations.voice} />
        <Button variant="secondary" onClick={save} disabled={saved} icon={saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}>{saved ? "Saved" : "Save result"}</Button>
      </div>

      <section className="mt-8 rounded-[var(--radius-card)] bg-primary px-5 py-6 text-background">
        <div className="flex items-start gap-3"><Users aria-hidden="true" className="mt-1 shrink-0" size={22} /><div><h2 className="font-heading text-xl text-background">Not sure? Ask someone you trust.</h2><p className="mt-1 text-sm text-background/80">A family member can be a second pair of eyes. This is optional.</p><Link to="/family" className={buttonClasses({ variant: "light", size: "md", className: "mt-4" })}>Ask someone you trust</Link></div></div>
      </section>

      <Link to="/history" className="mt-5 inline-flex tap-target items-center text-sm font-medium text-primary hover:text-primary-dark">View saved checks</Link>
      <p className="mt-5 text-xs leading-relaxed text-foreground-soft">ScamLens is a second opinion and can make mistakes. For financial, account, or safety decisions, verify through an official channel you already trust.</p>
    </main>
  );
}
