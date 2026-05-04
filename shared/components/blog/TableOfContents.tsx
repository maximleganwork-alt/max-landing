import { List } from "lucide-react";
import type { PostHeading } from "../../lib/blog-utils";

interface TableOfContentsProps {
  items: PostHeading[];
}

/**
 * Оглавление статьи: H2 + вложенные H3. Серверный компонент: ссылки —
 * обычные `<a href="#…">`, без JS, поэтому работает и в RSS-агрегаторах,
 * и в текстовых браузерах. Якоря синхронизированы с `mdx-components.tsx`
 * через ту же `slugifyHeading`. Скрываем, если в посте < 3 H2 — TOC из
 * двух пунктов выглядит шумом.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const h2s = items.filter((h) => h.depth === 2);
  if (h2s.length < 3) return null;

  // Группируем H3 под их H2 — простой проход вперёд.
  const grouped: { h2: PostHeading; h3: PostHeading[] }[] = [];
  for (const h of items) {
    if (h.depth === 2) {
      grouped.push({ h2: h, h3: [] });
    } else if (grouped.length > 0) {
      grouped[grouped.length - 1].h3.push(h);
    }
  }

  return (
    <nav
      aria-label="Содержание статьи"
      className="not-prose my-8 rounded-[var(--radius-lg)] border border-border bg-bg-card p-5 sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-body-sm font-semibold uppercase tracking-wide text-fg-subtle">
        <List aria-hidden="true" className="h-4 w-4" />
        <span>Содержание</span>
      </div>
      <ol className="flex flex-col gap-1.5 text-body-sm">
        {grouped.map(({ h2, h3 }) => (
          <li key={h2.id}>
            <a
              href={`#${h2.id}`}
              className="block py-1 text-fg-muted hover:text-fg transition-colors"
            >
              {h2.text}
            </a>
            {h3.length > 0 ? (
              <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                {h3.map((sub) => (
                  <li key={sub.id}>
                    <a
                      href={`#${sub.id}`}
                      className="block py-0.5 text-caption text-fg-subtle hover:text-fg transition-colors"
                    >
                      {sub.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
