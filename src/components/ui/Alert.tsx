import type { ReactNode } from "react";
import { Info, TriangleAlert, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "warning" | "offline";

const TONE_META: Record<AlertTone, { icon: typeof Info; classes: string; iconClass: string }> = {
  info: { icon: Info, classes: "bg-blue-light border-blue/20 text-navy", iconClass: "text-blue" },
  warning: { icon: TriangleAlert, classes: "bg-orange-bg border-orange/30 text-navy", iconClass: "text-orange" },
  offline: { icon: WifiOff, classes: "bg-surface-secondary border-border text-text-body", iconClass: "text-text-secondary" },
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
    <div role="alert" className={cn("flex gap-3.5 rounded-[16px] border p-4 sm:p-5", meta.classes)}>
      <Icon aria-hidden="true" size={22} className={cn("mt-0.5 shrink-0", meta.iconClass)} />
      <div className="flex-1">
        <p className="font-semibold text-navy">{title}</p>
        {children && <p className="mt-1 text-sm text-text-body leading-relaxed">{children}</p>}
        {action && <div className="mt-3.5">{action}</div>}
      </div>
    </div>
  );
}
