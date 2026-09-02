import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { RiskHeader } from "@/components/risk/RiskPill";
import { Checklist } from "@/components/ui/Checklist";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ReadAloudButton } from "@/components/voice/ReadAloudButton";
import { getResult } from "@/lib/result-store";
import { listHistory, saveToHistory } from "@/services/history-service";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { track } from "@/lib/analytics";

export function ResultPage() {
  const { id } = useParams();
  const result = id ? getResult(id) : undefined;
  useDocumentHead({ title: result ? "Your ScamLens result" : "Result unavailable", description: result ? "Review the ScamLens risk assessment and recommended next steps." : "This ScamLens result is no longer available in this session.", path: `/result/${id ?? "unknown"}`, index: false });
  const [simple, setSimple] = useState(false);
  const [saved, setSaved] = useState(() => !!id && listHistory().some((entry) => entry.id === id));

  if (!result) {
    return <main className="container-page py-14"><Alert tone="warning" title="This result is no longer available.">Results are kept in this session only. If you refreshed the page, check the message again to create a new result.</Alert><Link to="/analyze" className="mt-5 inline-flex"><Button>Check something</Button></Link></main>;
  }

  const { analysis } = result;
  const explanation = simple ? analysis.explanations.simple : analysis.explanations.technical;

  function save() {
    saveToHistory(analysis);
    setSaved(true);
    track("result_saved", { riskLevel: analysis.riskLevel });
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <Link to="/analyze" className="tap-target inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-pine"><ArrowLeft aria-hidden="true" size={17} /> Check another</Link>
      <div className="mt-7"><RiskHeader level={analysis.riskLevel} score={analysis.riskScore} /></div>

      <section className="mt-8">
        <h1 className="font-display text-2xl">Why we're concerned</h1>
        <p className="mt-3 text-[1.02rem] text-ink-soft">{analysis.summary}</p>
        <div className="mt-5 space-y-3">
          {analysis.warningSigns.map((sign) => <Card key={`${sign.type}-${sign.explanation}`} className="p-4"><p className="font-medium capitalize">{sign.type.replaceAll("_", " ")}</p><p className="mt-1 text-sm text-ink-soft">{sign.explanation}</p></Card>)}
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4"><h2 className="font-display text-2xl">What this means</h2><Button variant="quiet" size="md" onClick={() => setSimple((value) => !value)}>{simple ? "Show more detail" : "Explain it simply"}</Button></div>
        <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{explanation}</p>
        <div className="mt-4 flex flex-wrap gap-2"><ReadAloudButton text={analysis.explanations.voice} /><span className="inline-flex items-center rounded-full bg-pine-soft px-3 py-2 text-sm text-pine-dark">Confidence: {Math.round(analysis.confidence * 100)}%</span></div>
      </section>

      <div className="mt-9 grid gap-8 sm:grid-cols-2">
        <Checklist title="What to do" items={analysis.recommendedActions} tone="do" />
        <Checklist title="What not to do" items={analysis.avoidActions} tone="avoid" />
      </div>

      <section className="mt-9 rounded-[var(--radius-card)] bg-pine px-5 py-6 text-paper">
        <div className="flex items-start gap-3"><Users aria-hidden="true" className="mt-1 shrink-0" size={22} /><div><h2 className="font-display text-xl text-paper">Want a second pair of eyes?</h2><p className="mt-1 text-sm text-paper/80">Asking a trusted family member is optional. ScamLens works without one.</p><Link to="/family" className="mt-4 inline-flex"><Button variant="secondary" className="border-paper/40 bg-paper text-pine hover:bg-paper/90">Ask a family member</Button></Link></div></div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3"><Button variant="secondary" onClick={save} disabled={saved} icon={saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}>{saved ? "Saved to history" : "Save to history"}</Button><Link to="/history" className="inline-flex"><Button variant="quiet">View history</Button></Link></div>
      <p className="mt-5 text-xs leading-relaxed text-ink-soft">ScamLens is an AI-powered second opinion. It can make mistakes. For financial, account, or safety decisions, verify through an official channel you already trust.</p>
    </main>
  );
}
