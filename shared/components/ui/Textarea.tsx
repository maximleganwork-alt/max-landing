"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 3, ...props }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const localRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        localRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref],
    );

    const autosize = useCallback(() => {
      const el = localRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    // авто-подгон высоты на каждом ре-рендере (включая form.reset())
    useLayoutEffect(() => {
      autosize();
    });

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-body-sm font-medium text-fg">
            {label}
          </label>
        ) : null}
        <textarea
          ref={setRefs}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          onInput={autosize}
          className={cn(
            "w-full rounded-[var(--radius-sm)] border bg-bg-card px-4 py-3 text-body text-fg",
            "placeholder:text-fg-subtle resize-none overflow-hidden",
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

Textarea.displayName = "Textarea";
