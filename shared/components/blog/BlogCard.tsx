import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostSummary } from "../../lib/content/blog";
import { formatBlogDate } from "../../lib/blog-utils";

interface BlogCardProps {
  post: BlogPostSummary;
  /** Карточка-герой растягивается во всю ширину сетки. */
  variant?: "default" | "featured";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const isFeatured = variant === "featured";
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch
      aria-label={post.title}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      {/* Программная обложка — градиент бренда + крупное «B». */}
      <div
        className={isFeatured ? "h-48 sm:h-64" : "h-40"}
        style={{
          background:
            "linear-gradient(135deg, var(--brand-grad-from) 0%, var(--brand-grad-to) 100%)",
        }}
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center px-6">
          <p
            className={
              isFeatured
                ? "text-white text-h2 font-bold text-balance text-center leading-tight line-clamp-3"
                : "text-white text-h3 font-bold text-balance text-center leading-tight line-clamp-3"
            }
          >
            {post.title}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-caption text-fg-subtle">
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          {post.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-bg-subtle px-2 py-0.5 text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <h3
          className={
            isFeatured
              ? "text-h2 font-semibold text-fg leading-snug line-clamp-3"
              : "text-h3 font-semibold text-fg leading-snug line-clamp-3"
          }
        >
          {post.title}
        </h3>

        <p className="text-body-sm text-fg-muted leading-relaxed line-clamp-3">
          {post.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-body-sm font-medium text-fg-muted transition-colors group-hover:text-fg">
          Читать
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
