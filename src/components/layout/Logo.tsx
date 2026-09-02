import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-lg text-ink", className)}>
      <ShieldCheck aria-hidden="true" size={22} className="text-pine" strokeWidth={2.25} />
      ScamLens
    </span>
  );
}
