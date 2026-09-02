import type { ReactNode } from "react";
import { Info, TriangleAlert, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "warning" | "offline";

const TONE_META: Record<AlertTone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "bg-pine-soft border-pine/25 text-pine-dark" },
  warning: { icon: TriangleAlert, classes: "bg-risk-caution-soft border-risk-caution/30 text-risk-caution" },
  offline: { icon: WifiOff, classes: "bg-ink/5 border-ink/15 text-ink-soft" },
};

interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

export function Alert({ tone = "info", title, children, action }: AlertProps) {
  const meta = TONE_META[tone];
  const Icon = meta.icon;
  return (
    <div role="alert" className={cn("flex gap-3 rounded-[var(--radius-card)] border p-4", meta.classes)}>
      <Icon aria-hidden="true" size={20} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {children && <p className="mt-1 text-sm opacity-90">{children}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
