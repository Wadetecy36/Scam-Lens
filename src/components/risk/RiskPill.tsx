import { CheckCircle2, Eye, TriangleAlert, OctagonAlert } from "lucide-react";
import type { RiskLevel } from "@/ai/scam-analysis/schema";
import { RISK_LEVEL_COPY } from "@/ai/scam-analysis/schema";
import { cn } from "@/lib/cn";

const RISK_META: Record<
  RiskLevel,
  { icon: typeof CheckCircle2; text: string; bg: string; border: string; position: number }
> = {
  LOW: { icon: CheckCircle2, text: "text-risk-low", bg: "bg-risk-low-soft", border: "border-risk-low/30", position: 12 },
  CAUTION: { icon: Eye, text: "text-risk-caution", bg: "bg-risk-caution-soft", border: "border-risk-caution/30", position: 40 },
  SUSPICIOUS: {
    icon: TriangleAlert,
    text: "text-risk-suspicious",
    bg: "bg-risk-suspicious-soft",
    border: "border-risk-suspicious/30",
    position: 65,
  },
  HIGH: { icon: OctagonAlert, text: "text-risk-high", bg: "bg-risk-high-soft", border: "border-risk-high/30", position: 90 },
};

interface RiskPillProps {
  level: RiskLevel;
  score: number;
  size?: "sm" | "lg";
  className?: string;
}

/** Compact pill: icon + word + number. Used in lists and cards. */
export function RiskPill({ level, score, size = "sm", className }: RiskPillProps) {
  const meta = RISK_META[level];
  const Icon = meta.icon;
  const copy = RISK_LEVEL_COPY[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border font-medium",
        meta.bg,
        meta.text,
        meta.border,
        size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2 text-base",
        className,
      )}
    >
      <Icon aria-hidden="true" size={size === "sm" ? 15 : 18} strokeWidth={2.25} />
      <span>{copy.label}</span>
      <span className="opacity-70">· {Math.round(score)}/100</span>
    </span>
  );
}

/** Full risk header for the result screen: pill, ramp position, and description — three channels, never color alone. */
export function RiskHeader({ level, score, showScale = true }: { level: RiskLevel; score: number; showScale?: boolean }) {
  const meta = RISK_META[level];
  const copy = RISK_LEVEL_COPY[level];
  const Icon = meta.icon;

  return (
    <div className="animate-settle" role="status" aria-live="polite">
      <div className={cn("flex items-center gap-3 rounded-[var(--radius-card)] border p-4", meta.bg, meta.border)}>
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70", meta.text)}>
          <Icon aria-hidden="true" size={24} strokeWidth={2.25} />
        </span>
        <div>
          <p className={cn("font-display text-xl leading-tight", meta.text)}>{copy.label}</p>
          <p className="text-sm text-ink-soft">{copy.description}</p>
        </div>
      </div>

      {showScale && (
        <div className="mt-3">
          <div className="relative h-1.5 w-full rounded-full bg-ink/10">
            <div
              className={cn("absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-sm", meta.text)}
              style={{ left: `${meta.position}%`, backgroundColor: "currentColor" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
            <span>Low</span>
            <span>Caution</span>
            <span>Suspicious</span>
            <span>High</span>
          </div>
        </div>
      )}

      <p className="sr-only">Numeric risk score: {Math.round(score)} out of 100.</p>
    </div>
  );
}
