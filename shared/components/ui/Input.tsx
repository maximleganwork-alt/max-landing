"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = "text", ...props }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-body-sm font-medium text-fg">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className={cn(
            "h-12 w-full rounded-[var(--radius-sm)] border bg-bg-card px-4 text-body text-fg",
            "placeholder:text-fg-subtle",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "read-only:opacity-70",
            error
              ? "border-error focus-visible:ring-error"
              : "border-border hover:border-border-strong",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p id={hintId} className="text-caption text-fg-subtle">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="text-caption text-error">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
