import { CheckCircle2, Eye, TriangleAlert, OctagonAlert } from "lucide-react";
import type { RiskLevel } from "@/ai/scam-analysis/schema";
import { RISK_LEVEL_COPY } from "@/ai/scam-analysis/schema";
import { cn } from "@/lib/cn";

const RISK_META: Record<
  RiskLevel,
  { icon: typeof CheckCircle2; text: string; bg: string; border: string; position: number }
> = {
  LOW: {
    icon: CheckCircle2,
    text: "text-green",
    bg: "bg-green-bg",
    border: "border-green/25",
    position: 12,
  },
  CAUTION: {
    icon: Eye,
    text: "text-orange",
    bg: "bg-orange-bg",
    border: "border-orange/25",
    position: 38,
  },
  SUSPICIOUS: {
    icon: TriangleAlert,
    text: "text-[#C2410C]",
    bg: "bg-orange-bg",
    border: "border-orange/40 shadow-xs",
    position: 65,
  },
  HIGH: {
    icon: OctagonAlert,
    text: "text-red",
    bg: "bg-red-bg",
    border: "border-red/30",
    position: 90,
  },
};

interface RiskPillProps {
  level: RiskLevel;
  score: number;
  size?: "sm" | "lg";
  className?: string;
}

/** Compact pill: icon + word + number. Used in lists and cards. Never color alone. */
export function RiskPill({ level, score, size = "sm", className }: RiskPillProps) {
  const meta = RISK_META[level];
  const Icon = meta.icon;
  const copy = RISK_LEVEL_COPY[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        meta.bg,
        meta.text,
        meta.border,
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
        className,
      )}
    >
      <Icon aria-hidden="true" size={size === "sm" ? 14 : 16} strokeWidth={2.5} />
      <span>{copy.label}</span>
      <span className="opacity-75">· {Math.round(score)}/100</span>
    </span>
  );
}

/** Full risk header for the result screen: pill, ramp position, and description — three channels, never color alone. */
export function RiskHeader({
  level,
  score,
  showScale = true,
}: {
  level: RiskLevel;
  score: number;
  showScale?: boolean;
}) {
  const meta = RISK_META[level];
  const copy = RISK_LEVEL_COPY[level];
  const Icon = meta.icon;

  return (
    <div className="animate-settle" role="status" aria-live="polite">
      <div className={cn("flex items-center gap-4 rounded-[18px] border p-5 sm:p-6", meta.bg, meta.border)}>
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs", meta.text)}>
          <Icon aria-hidden="true" size={26} strokeWidth={2.5} />
        </span>
        <div>
          <div className="flex items-center gap-2.5">
            <span className={cn("font-heading text-2xl font-bold leading-tight", meta.text)}>
              {copy.label}
            </span>
            <span className={cn("text-xs font-bold uppercase tracking-wider rounded-md px-2 py-0.5 bg-white/80", meta.text)}>
              Score: {Math.round(score)}/100
            </span>
          </div>
          <p className="mt-1 text-[15px] text-text-body">{copy.description}</p>
        </div>
      </div>

      {showScale && (
        <div className="mt-4">
          <div className="relative h-2 w-full rounded-full bg-border">
            <div
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-md",
                meta.text,
              )}
              style={{ left: `${meta.position}%`, backgroundColor: "currentColor" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-semibold text-text-secondary">
            <span>Low (0-24)</span>
            <span>Caution (25-49)</span>
            <span>Suspicious (50-74)</span>
            <span>High (75-100)</span>
          </div>
        </div>
      )}

      <p className="sr-only">Numeric risk score: {Math.round(score)} out of 100.</p>
    </div>
  );
}
