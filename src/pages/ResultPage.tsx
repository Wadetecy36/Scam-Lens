import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ShieldCheck,
  Globe,
  ShieldAlert,
  CheckCircle2,
  Zap,
  MessageCircle,
} from "lucide-react";
import { RiskHeader } from "@/components/risk/RiskPill";
import { Checklist } from "@/components/ui/Checklist";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/button-classes";
import { Alert } from "@/components/ui/Alert";
import { ReadAloudButton } from "@/components/voice/ReadAloudButton";
import { getResult } from "@/lib/result-store";
import { listHistory, saveToHistory } from "@/services/history-service";
import { fetchPublicResult } from "@/services/analysis-service";
import type { ScamAnalysis } from "@/ai/scam-analysis/schema";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { track } from "@/lib/analytics";

export function ResultPage() {
  const { id } = useParams();
  const localResult = id ? getResult(id) : undefined;
  const [fetchedAnalysis, setFetchedAnalysis] = useState<ScamAnalysis | null>(null);
  const [loading, setLoading] = useState(!localResult && !!id);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!localResult && id) {
      let cancelled = false;
      setLoading(true);
      fetchPublicResult(id).then((data) => {
        if (cancelled) return;
        if (data) {
          setFetchedAnalysis(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    } else {
      setLoading(false);
    }
  }, [id, localResult]);

  const analysis: ScamAnalysis | undefined = localResult?.analysis ?? fetchedAnalysis ?? undefined;

  useDocumentHead({
    title: analysis ? "Your ScamLens result" : "Result unavailable",
    description: analysis
      ? "See what ScamLens recommends you do next."
      : "This ScamLens result is no longer available or has expired.",
    path: `/result/${id ?? "unknown"}`,
    index: false,
  });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState(() => !!id && listHistory().some((entry) => entry.id === id));

  if (loading) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue animate-pulse">
          <ShieldCheck size={32} />
        </div>
        <p className="mt-4 text-base font-bold text-navy">Loading ScamLens report…</p>
        <p className="mt-1 text-sm text-foreground-soft">Checking safety records</p>
      </main>
    );
  }

  if (!analysis || notFound) {
    return (
      <main className="container-page py-14">
        <Alert tone="warning" title="This result is no longer available.">
          Security reports expire after 30 days or may have been cleared. If you need a new check, you can scan the message again below.
        </Alert>
        <Link to="/analyze" className={buttonClasses({ className: "mt-6 inline-flex" })}>
          Check something
        </Link>
      </main>
    );
  }

  const topAction = analysis.recommendedActions[0] ?? "Don't click, reply, or send money until you've verified it.";

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://scam-lens-blue.vercel.app/result/${id}`;
  const shareText = `⚠️ ScamLens Security Notice:\nI checked a message/link on ScamLens.\n• Risk: ${analysis.riskLevel} (${Math.round(analysis.riskScore)}/100)\n• Advice: ${topAction}\n• Why: ${analysis.explanations.simple || analysis.summary}\n\nFull check: ${currentUrl}`;
  const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const askFamilyText = `Hi, I checked a message on ScamLens that feels suspicious:\n• Risk Level: ${analysis.riskLevel}\n• Advice: "${topAction}"\n\nCan you take a look at the full report and tell me what you think?\n${currentUrl}`;
  const whatsAppAskFamilyUrl = `https://wa.me/?text=${encodeURIComponent(askFamilyText)}`;

  function save() {
    if (!analysis) return;
    saveToHistory(analysis);
    setSaved(true);
    track("result_saved", { riskLevel: analysis.riskLevel });
  }

  return (
    <main className="container-page py-8 sm:py-12">
      <Link
        to="/analyze"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft aria-hidden="true" size={16} /> Check another
      </Link>

      {/* Main Risk Header Banner */}
      <div className="mt-6">
        <RiskHeader level={analysis.riskLevel} score={analysis.riskScore} showScale={false} />
      </div>

      {/* Offline Mode Notice */}
      {analysis.id.startsWith("offline_") && (
        <aside
          className="mt-6 rounded-2xl border border-orange/20 bg-orange-soft p-4 sm:p-5 text-navy"
          aria-label="Offline Mode Notice"
        >
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 shrink-0 text-orange" size={20} aria-hidden="true" />
            <div className="text-sm">
              <strong className="font-bold text-navy">Analyzed in Offline Safety Mode (Zero Mobile Data)</strong>
              <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
                This check was computed directly on your device without internet data using local scam pattern rules. When you are back online, you can re-run this check for full AI and live cybersecurity database scans.
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* Primary Action Guidance Card */}
      <section className="mt-6 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-2xs" aria-labelledby="action-heading">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
            <ShieldCheck aria-hidden="true" size={24} />
          </div>
          <div>
            <h1 id="action-heading" className="text-xl sm:text-2xl font-bold text-navy">
              What should I do?
            </h1>
            <p className="mt-2 text-base sm:text-lg font-medium text-navy leading-relaxed">
              {topAction}
            </p>
          </div>
        </div>
      </section>

      {/* Threat Intelligence Scan Card */}
      {analysis.threatIntel && analysis.threatIntel.length > 0 && (
        <section
          className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
            analysis.threatIntel.some((t) => t.verdict === "malicious")
              ? "border-red-200 bg-red-soft text-red"
              : analysis.threatIntel.some((t) => t.verdict === "suspicious")
              ? "border-orange-200 bg-orange-soft text-orange"
              : "border-border bg-surface text-navy"
          }`}
          aria-labelledby="threat-intel-heading"
        >
          <div className="flex items-start gap-3.5">
            {analysis.threatIntel.some((t) => t.verdict === "malicious") ? (
              <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-red" size={24} />
            ) : analysis.threatIntel.some((t) => t.verdict === "suspicious") ? (
              <Globe aria-hidden="true" className="mt-0.5 shrink-0 text-orange" size={24} />
            ) : (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-green" size={24} />
            )}
            <div className="flex-1">
              <h2 id="threat-intel-heading" className="text-base sm:text-lg font-bold">
                Threat Intelligence Database Scan
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {analysis.threatIntel.map((intel, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-t border-border/20 pt-2 first:border-0 first:pt-0">
                    <div>
                      <span className="font-bold">{intel.provider}</span>:{" "}
                      <span className="capitalize font-semibold">{intel.verdict}</span>
                      {intel.details ? ` — ${intel.details}` : ""}
                    </div>
                    <time dateTime={intel.checkedAt} className="text-xs opacity-75 shrink-0">
                      {new Date(intel.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Why We Think That */}
      <section className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-bold text-navy">Why we think that</h2>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-foreground-soft">
          {analysis.explanations.simple || analysis.summary}
        </p>

        {analysis.warningSigns.length > 0 && (
          <ul className="mt-6 space-y-4 border-t border-border pt-6">
            {analysis.warningSigns.map((sign) => (
              <li key={`${sign.type}-${sign.explanation}`} className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                <div>
                  <p className="text-base font-semibold capitalize text-navy">
                    {sign.type.replaceAll("_", " ")}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground-soft leading-relaxed">
                    {sign.explanation}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Technical Accordion */}
      <section className="mt-6 rounded-2xl border border-border bg-surface-secondary/50 p-5 sm:p-6 transition-colors">
        <button
          type="button"
          aria-expanded={detailsOpen}
          aria-controls="details-panel"
          onClick={() => setDetailsOpen((open) => !open)}
          className="tap-target flex w-full items-center justify-between gap-4 text-left cursor-pointer"
        >
          <span>
            <span className="block text-lg font-bold text-navy">Want more technical details?</span>
            <span className="text-sm text-foreground-soft">View confidence metrics, raw model scoring, and threat scans.</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            size={20}
            className={`text-secondary transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {detailsOpen && (
          <div id="details-panel" className="mt-5 border-t border-border pt-5">
            <p className="text-sm sm:text-base leading-relaxed text-foreground-soft">
              {analysis.explanations.technical}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-foreground-soft">
              <span>Risk score: <strong className="text-navy">{Math.round(analysis.riskScore)}/100</strong></span>
              <span>•</span>
              <span>Confidence: <strong className="text-navy">{Math.round(analysis.confidence * 100)}%</strong></span>
            </div>

            {analysis.threatIntel && analysis.threatIntel.length > 0 && (
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Security Database Verification
                </p>
                <div className="mt-2 space-y-1.5 text-xs sm:text-sm text-foreground-soft">
                  {analysis.threatIntel.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-border/10 last:border-0">
                      <span>{t.provider}</span>
                      <span className="font-semibold text-navy capitalize">
                        {t.verdict} (threat score: {t.threatScore}/100)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Action Checklists */}
      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <Checklist title="What to do" items={analysis.recommendedActions} tone="do" />
        <Checklist title="What not to do" items={analysis.avoidActions} tone="avoid" />
      </section>

      {/* Action Buttons Toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ReadAloudButton text={analysis.explanations.voice} />
        <Button
          variant="secondary"
          onClick={save}
          disabled={saved}
          icon={saved ? <BookmarkCheck size={18} className="text-green" /> : <Bookmark size={18} />}
        >
          {saved ? "Saved to history" : "Save result"}
        </Button>
        <a
          href={whatsAppShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target inline-flex items-center gap-2 rounded-xl border border-green/30 bg-green-soft px-4 py-2.5 text-sm font-semibold text-green hover:bg-green/10 transition-colors shadow-2xs"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Share on WhatsApp
        </a>
      </div>

      {/* Family Second Opinion Banner */}
      <section className="mt-10 rounded-2xl bg-navy p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Users aria-hidden="true" size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Not sure? Ask someone you trust.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Forward this check directly to a trusted family member or friend on WhatsApp for an immediate second opinion.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsAppAskFamilyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target inline-flex items-center gap-2 rounded-xl bg-green px-5 py-3 text-sm font-bold text-white hover:bg-green/90 transition-colors shadow-sm"
              >
                <MessageCircle size={18} />
                Ask family on WhatsApp
              </a>
              <Link
                to="/family"
                className="tap-target inline-flex items-center rounded-xl border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                More about family safety
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Saved checks navigation link & footer disclaimer */}
      <div className="mt-8 flex flex-col gap-4">
        <Link
          to="/history"
          className="tap-target inline-flex items-center text-sm font-semibold text-blue hover:underline"
        >
          View saved checks →
        </Link>
        <p className="text-xs leading-relaxed text-secondary">
          ScamLens is an AI and rules-based second opinion and can make mistakes. For financial, banking, or personal safety decisions, verify through an official telecom code (such as *170#) or an official branch.
        </p>
      </div>
    </main>
  );
}
