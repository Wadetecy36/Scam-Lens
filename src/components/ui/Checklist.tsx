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
    <section aria-labelledby={`checklist-${tone}`}>
      <h3 id={`checklist-${tone}`} className="font-display text-lg">
        {title}
      </h3>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                tone === "do" ? "bg-risk-low-soft text-risk-low" : "bg-risk-high-soft text-risk-high",
              )}
            >
              <Icon aria-hidden="true" size={13} strokeWidth={3} />
            </span>
            <span className="text-[0.95rem] leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function IconRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-pine">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
