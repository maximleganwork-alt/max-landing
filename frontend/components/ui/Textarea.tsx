"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  counter?: { current: number; max: number };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, counter, id, rows = 4, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className={cn(
            "w-full rounded-[var(--radius-sm)] border bg-bg-card px-4 py-3 text-body text-fg",
            "placeholder:text-fg-subtle resize-y min-h-[96px]",
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
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
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
          {counter ? (
            <span
              className={cn(
                "text-caption tabular-nums",
                counter.current > counter.max ? "text-error" : "text-fg-subtle",
              )}
            >
              {counter.current}/{counter.max}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
