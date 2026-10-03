import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-classes";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
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
