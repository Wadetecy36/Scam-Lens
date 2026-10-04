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
      <label htmlFor={htmlFor} className="mb-2 block text-[15px] font-semibold text-navy">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-2 text-sm text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-2 text-sm font-medium text-red" role="alert">
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
  const describedBy = error ? `${fieldId}-error` : (hint ? `${fieldId}-hint` : undefined);
  return (
    <FieldWrapper label={label} hint={hint} error={error} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-[16px] border border-border bg-white p-4 text-[16px] text-navy leading-relaxed transition-all duration-150",
          "placeholder:text-text-secondary/70 focus:border-blue focus:outline-none focus:ring-3 focus:ring-blue/15",
          error && "border-red focus:border-red focus:ring-red/15",
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
  const describedBy = error ? `${fieldId}-error` : (hint ? `${fieldId}-hint` : undefined);
  return (
    <FieldWrapper label={label} hint={hint} error={error} htmlFor={fieldId}>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "tap-target w-full rounded-[16px] border border-border bg-white px-4 text-[16px] text-navy min-h-[48px] transition-all duration-150",
          "placeholder:text-text-secondary/70 focus:border-blue focus:outline-none focus:ring-3 focus:ring-blue/15",
          error && "border-red focus:border-red focus:ring-red/15",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
}
