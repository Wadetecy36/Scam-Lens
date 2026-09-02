import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet" | "danger" | "light";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-pine text-paper hover:bg-pine-dark active:bg-pine-dark disabled:bg-ink-soft/40",
  secondary: "bg-transparent text-ink border border-ink/25 hover:border-ink/45 hover:bg-ink/5",
  quiet: "bg-transparent text-pine hover:bg-pine-soft",
  danger: "bg-risk-high text-paper hover:brightness-95",
  light: "bg-paper text-pine border border-paper/40 hover:bg-paper/90",
};

const sizeClasses: Record<Size, string> = {
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
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}): string {
  return cn(
    "tap-target inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, fullWidth, className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
        {icon}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
