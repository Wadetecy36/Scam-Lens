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
    "bg-primary text-on-primary hover:opacity-90 active:opacity-90 disabled:bg-muted/40",
  secondary:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary/5",
  accent:
    "bg-accent text-on-accent hover:opacity-90 active:opacity-90",
  danger: "bg-destructive text-on-destructive hover:brightness-95",
  light: "bg-background text-foreground border border-border hover:bg-background/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
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
    "tap-target cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}
