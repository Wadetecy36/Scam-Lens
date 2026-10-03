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
  const [error, setError] = useState<{ title: string; body: string; retry: boolean } | null>(null);

  async function submit() {
    if (disabled || loading) return;
    setError(null);
    setLoading(true);
    track("analysis_started", { inputType: type });
    try {
      const input = getInput();
      const analysis = await runScamAnalysis(input);
      const rawInput = input.type === "url" ? input.url : input.text;
      storeResult(analysis, rawInput);
      track("analysis_completed", { inputType: type, riskLevel: analysis.riskLevel });
      navigate(`/result/${analysis.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Input rejected")) {
        setError({
          title: "We can't check this text.",
          body: "It contains instructions aimed at our checker (for example \"ignore previous instructions\"). Real messages from banks or family don't do this, so treat it with suspicion. Remove those lines and try again if you still want a check.",
          retry: false,
        });
      } else if (msg.toLowerCase().includes("maximum number of analysis requests")) {
        setError({
          title: "Please wait a minute.",
          body: "You've made a lot of checks in a short time. Wait about a minute, then try again.",
          retry: false,
        });
      } else {
        setError({
          title: "The check didn't go through.",
          body: "We couldn't check that right now. Please try again.",
          retry: true,
        });
      }
      track("analysis_failed", { inputType: type });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <Link to="/analyze" className="tap-target inline-flex items-center gap-2 text-base font-medium text-foreground-soft hover:text-primary">
        <ArrowLeft aria-hidden="true" size={17} /> Choose another way
      </Link>
      <div className="mt-8 flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-1 shrink-0 text-primary" size={25} />
        <div>
          <h1 className="mt-1 font-heading text-4xl">{title}</h1>
        </div>
      </div>
      <p className="mt-4 max-w-xl text-lg text-foreground-soft">{description}</p>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="mt-8">{children}</div>
        {error && <div className="mt-5"><Alert tone="warning" title={error.title} action={error.retry ? <Button variant="secondary" onClick={submit}>Try again</Button> : undefined}>{error.body}</Alert></div>}
        <Button type="submit" className="mt-6 w-full sm:w-auto" size="lg" disabled={disabled || loading} icon={loading ? <LoaderCircle aria-hidden="true" size={18} className="animate-spin" /> : undefined}>
          {loading ? "Checking…" : "Check with ScamLens"}
        </Button>
        <p className="mt-4 text-sm text-foreground-soft">ScamLens gives a second opinion. It cannot guarantee that something is safe.</p>
      </form>
    </main>
  );
}
