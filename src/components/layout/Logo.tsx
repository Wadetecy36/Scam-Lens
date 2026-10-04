import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-heading text-[22px] sm:text-[24px] font-bold tracking-tight text-navy", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-icon-bg text-blue">
        <ShieldCheck aria-hidden="true" size={22} strokeWidth={2.5} />
      </span>
      <span>Scam<span className="text-blue">Lens</span></span>
    </span>
  );
}
