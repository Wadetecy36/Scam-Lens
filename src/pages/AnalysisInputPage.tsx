import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { runScamAnalysis } from "@/services/analysis-service";
import { storeResult } from "@/lib/result-store";
import { track } from "@/lib/analytics";
import type { AnalysisInputType, ScamAnalysisInput } from "@/ai/scam-analysis/schema";

interface Props {
  type: AnalysisInputType;
  title: string;
  description: string;
  children: ReactNode;
  getInput: () => ScamAnalysisInput;
  disabled?: boolean;
}

export function AnalysisInputPage({ type, title, description, children, getInput, disabled }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (disabled || loading) return;
    setError(null);
    setLoading(true);
    track("analysis_started", { inputType: type });
    try {
      const analysis = await runScamAnalysis(getInput());
      storeResult(analysis, getInput().text);
      track("analysis_completed", { inputType: type, riskLevel: analysis.riskLevel });
      navigate(`/result/${analysis.id}`);
    } catch {
      setError("We couldn't check that right now. Please try again.");
      track("analysis_failed", { inputType: type });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <Link to="/analyze" className="tap-target inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-pine">
        <ArrowLeft aria-hidden="true" size={17} /> Choose another way
      </Link>
      <div className="mt-8 flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-1 shrink-0 text-pine" size={25} />
        <div>
          <h1 className="mt-1 font-display text-4xl">{title}</h1>
        </div>
      </div>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">{description}</p>
      <div className="mt-8">{children}</div>
      {error && <div className="mt-5"><Alert tone="warning" title="The check didn't go through." action={<Button variant="secondary" onClick={submit}>Try again</Button>}>{error}</Alert></div>}
      <Button className="mt-6 w-full sm:w-auto" size="lg" onClick={submit} disabled={disabled || loading} icon={loading ? <LoaderCircle aria-hidden="true" size={18} className="animate-spin" /> : undefined}>
        {loading ? "Checking…" : "Check with ScamLens"}
      </Button>
      <p className="mt-4 text-sm text-ink-soft">ScamLens gives a second opinion. It cannot guarantee that something is safe.</p>
    </main>
  );
}
