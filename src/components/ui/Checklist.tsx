import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChecklistProps {
  items: string[];
  tone: "do" | "avoid";
  title: string;
}

export function Checklist({ items, tone, title }: ChecklistProps) {
  if (items.length === 0) return null;
  const Icon = tone === "do" ? Check : X;
  return (
    <section
      aria-labelledby={`checklist-${tone}`}
      className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-2xs"
    >
      <h3 id={`checklist-${tone}`} className="text-base sm:text-lg font-bold text-navy">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                tone === "do"
                  ? "bg-green-soft text-green"
                  : "bg-red-soft text-red",
              )}
            >
              <Icon aria-hidden="true" size={13} strokeWidth={3} />
            </span>
            <span className="text-sm leading-relaxed text-foreground-soft font-medium">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function IconRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue">{icon}</span>
      <span className="text-sm sm:text-base leading-relaxed text-foreground-soft">{children}</span>
    </div>
  );
}
