import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface InlineCTAProps {
  /** Короткая фраза-подводка, обычно одна строка. */
  children: ReactNode;
  /** Текст кликабельной ссылки. По умолчанию «Обсудить проект». */
  action?: string;
  /** Куда вести. По умолчанию якорь к лид-форме главной. */
  href?: string;
}

/**
 * Узкая «подсказка» внутри текста статьи — мостик к лид-форме без
 * навязчивости. Использовать примерно после 50% поста.
 */
export function InlineCTA({
  children,
  action = "Обсудить проект",
  href = "/#lead-form",
}: InlineCTAProps) {
  return (
    <aside
      className="my-8 flex flex-col gap-2 rounded-[var(--radius)] bg-bg-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="text-body-sm text-fg leading-relaxed [&_p]:my-0 [&_p]:text-fg">{children}</div>
      <Link
        href={href}
        prefetch
        className="inline-flex shrink-0 items-center gap-1.5 text-body-sm font-medium [color:var(--brand-grad-from)] hover:underline"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
