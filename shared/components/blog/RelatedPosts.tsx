import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostSummary } from "../../lib/content/blog";
import { formatBlogDate } from "../../lib/blog-utils";

interface RelatedPostsProps {
  items: BlogPostSummary[];
}

/**
 * Подвал статьи: 3 «похожие» по тегам. Внутренние ссылки повышают
 * глубину просмотра и помогают перетеканию веса в SEO.
 */
export function RelatedPosts({ items }: RelatedPostsProps) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16 border-t border-border pt-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-h2 font-bold text-fg">
        Похожие статьи
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              prefetch
              className="card card-hover group flex h-full flex-col gap-3 p-5"
            >
              <time className="text-caption text-fg-subtle" dateTime={p.date}>
                {formatBlogDate(p.date)}
              </time>
              <h3 className="text-body-lg font-semibold text-fg leading-snug line-clamp-3">
                {p.title}
              </h3>
              <p className="text-body-sm text-fg-muted leading-relaxed line-clamp-2">
                {p.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-body-sm font-medium text-fg-muted transition-colors group-hover:text-fg">
                Читать
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
