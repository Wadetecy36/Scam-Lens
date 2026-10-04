import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "danger"
  | "light";

export type ButtonSize = "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue text-white hover:bg-navy active:bg-navy-dark shadow-sm disabled:bg-border disabled:text-text-secondary",
  secondary:
    "bg-white text-navy border border-border hover:bg-surface-secondary hover:border-blue/40 shadow-sm",
  accent:
    "bg-blue text-white hover:bg-navy active:bg-navy-dark",
  danger: "bg-red text-white hover:brightness-95",
  light: "bg-surface-secondary text-navy border border-border hover:bg-blue-icon-bg hover:text-blue",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-[15px] min-h-[48px]",
  lg: "px-7 py-3.5 text-base min-h-[52px]",
};

/** Shared class builder so non-<button> elements (e.g. <Link>) can look like a Button. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "tap-target cursor-pointer inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-150",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}
