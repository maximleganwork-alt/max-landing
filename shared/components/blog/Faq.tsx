import type { ReactNode } from "react";
import { slugifyHeading } from "../../lib/blog-utils";

interface FaqProps {
  /** Заголовок секции — по умолчанию «Частые вопросы». */
  title?: string;
  children: ReactNode;
}

interface FaqItemProps {
  /** Текст вопроса — обязательно строкой, чтобы попасть в FAQPage schema. */
  q: string;
  children: ReactNode;
}

/**
 * Семантическая FAQ-секция для постов. Используется как:
 *
 *   <Faq>
 *     <FaqItem q="Сколько стоит бот?">
 *       Стартовая интеграция — от 80 000 ₽.
 *     </FaqItem>
 *   </Faq>
 *
 * Сами вопросы рендерятся через `<details>`/`<summary>` — без JS, доступно,
 * сворачивается по дефолту. Schema.org FAQPage генерится отдельно, при сборке
 * страницы поста: `extractFaqEntries(post.body)` вытащит пары Q/A и положит
 * их в `<JsonLd faqItems={…}>` (см. blog-utils.ts).
 */
export function Faq({ title = "Частые вопросы", children }: FaqProps) {
  return (
    <section
      aria-label={title}
      className="not-prose my-10 rounded-[var(--radius-lg)] border border-border bg-bg-card p-5 sm:p-6"
    >
      <h2
        id={slugifyHeading(title)}
        className="mb-4 scroll-mt-[calc(var(--header-height)+24px)] text-h3 font-bold text-fg"
      >
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-border">{children}</div>
    </section>
  );
}

export function FaqItem({ q, children }: FaqItemProps) {
  return (
    <details
      className="group py-4 first:pt-0 last:pb-0"
      // itemprop ради Microdata-совместимости — FAQPage всё равно идёт через
      // JSON-LD, но микроданные дополнительно подсказывают парсерам, что это
      // вопрос-ответ, и не нагружают JSON-LD дублированием.
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <summary
        className="flex cursor-pointer list-none items-start justify-between gap-4 text-body font-semibold text-fg [&::-webkit-details-marker]:hidden"
        itemProp="name"
      >
        <span>{q}</span>
        <span
          aria-hidden="true"
          className="mt-0.5 select-none text-fg-subtle transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div
        className="mt-3 text-body text-fg-muted leading-relaxed [&>p]:my-2 [&>p:first-child]:mt-0"
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div itemProp="text">{children}</div>
      </div>
    </details>
  );
}
