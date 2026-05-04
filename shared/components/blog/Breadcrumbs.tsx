import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  /** Относительный или абсолютный URL. Если последний — будет рендериться без ссылки. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Хлебные крошки на странице. Дублируют BreadcrumbList в JSON-LD, но видимы
 * пользователю и помогают Google показывать их в SERP-сниппете.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Хлебные крошки" className="text-body-sm text-fg-subtle">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.name}-${idx}`} className="inline-flex items-center gap-1 min-w-0">
              {idx > 0 ? (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-fg-subtle/70" />
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate max-w-[60ch] text-fg-muted"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  prefetch
                  className="truncate max-w-[40ch] hover:text-fg transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
