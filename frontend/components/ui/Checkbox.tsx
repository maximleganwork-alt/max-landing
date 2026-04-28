"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-start gap-3 text-body-sm text-fg-muted leading-relaxed"
        >
          <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "peer absolute inset-0 cursor-pointer appearance-none rounded-[6px] border bg-bg-card",
                "transition-colors duration-150",
                "checked:bg-primary checked:border-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                "disabled:cursor-not-allowed disabled:opacity-60",
                error ? "border-error" : "border-border-strong",
                className,
              )}
              {...props}
            />
            <Check
              className="pointer-events-none h-3.5 w-3.5 text-primary-fg opacity-0 peer-checked:opacity-100 transition-opacity"
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
          {label ? <span className="select-none">{label}</span> : null}
        </label>
        {error ? (
          <p id={errorId} role="alert" className="text-caption text-error pl-8">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
