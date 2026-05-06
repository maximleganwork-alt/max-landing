"use client";

import { useId, useState, type ReactNode } from "react";
import { m } from "framer-motion";
import { Plus } from "lucide-react";
import { reachGoal } from "../../lib/analytics";
import { cn } from "../../lib/utils";

export interface AccordionItemProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `${id}-content`;
  const buttonId = `${id}-trigger`;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) reachGoal("faq_open", { question });
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={handleToggle}
          className={cn(
            "flex w-full items-center justify-between gap-4 py-5 text-left",
            "text-body-lg font-medium text-fg",
            "transition-colors duration-150 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
          )}
        >
          <span className="flex-1">{question}</span>
          <m.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-fg-muted"
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </m.span>
        </button>
      </h3>
      {/* Контент всегда в DOM — нужно для FAQ Rich Results (Google требует
          видимые в HTML ответы) и для индексации текста краулерами. Анимация
          через height: auto ↔ 0, скрытие от screen-readers — aria-hidden. */}
      <m.div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="pb-5 text-body text-fg-muted leading-relaxed">{children}</div>
      </m.div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-border">{children}</div>;
}
