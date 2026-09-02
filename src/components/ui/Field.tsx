import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface FieldWrapperProps {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, hint, error, htmlFor, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-sm text-risk-high" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextAreaField({ label, hint, error, className, id, ...props }: TextAreaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper label={label} hint={hint} error={error} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-[var(--radius-card)] border border-ink/20 bg-white/70 p-4 text-[1rem] leading-relaxed",
          "placeholder:text-ink-soft/60 focus:border-pine",
          error && "border-risk-high",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function InputField({ label, hint, error, className, id, ...props }: InputFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldWrapper label={label} hint={hint} error={error} htmlFor={fieldId}>
      <input
        id={fieldId}
        aria-invalid={!!error}
        className={cn(
          "tap-target w-full rounded-[var(--radius-card)] border border-ink/20 bg-white/70 px-4 text-[1rem]",
          "placeholder:text-ink-soft/60 focus:border-pine",
          error && "border-risk-high",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
}
