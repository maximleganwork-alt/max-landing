import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { BlogPost as BlogPostT, BlogPostSummary } from "../../lib/content/blog";
import {
  formatBlogDate,
  extractPostHeadings,
  estimateReadingTime,
} from "../../lib/blog-utils";
import { mdxComponents } from "./mdx-components";
import { EndCTA } from "./EndCTA";
import { RelatedPosts } from "./RelatedPosts";
import { TableOfContents } from "./TableOfContents";
import { Breadcrumbs } from "./Breadcrumbs";

interface BlogPostProps {
  post: BlogPostT;
  /** 3 похожие статьи (вычислены на сервере по тегам). */
  related: BlogPostSummary[];
  /** Базовый URL сайта — нужен для абсолютных ссылок в крошках. */
  siteUrl: string;
}

/**
 * Серверный компонент: рендерит MDX-тело через next-mdx-remote/rsc,
 * добавляет хлебные крошки, шапку (дата/обновление/время чтения),
 * оглавление, теги, related-блок и финальный CTA. Финальный CTA
 * добавляется автоматически на случай, если автор поста забыл вставить
 * `<EndCTA>` в конце MDX.
 */
export function BlogPostView({ post, related, siteUrl }: BlogPostProps) {
  const hasInlineEndCTA = /<EndCTA[\s>]/.test(post.body);
  const headings = extractPostHeadings(post.body);
  const reading = estimateReadingTime(post.body);

  return (
    <article
      className="container-narrow max-w-3xl pb-20"
      // schema.org Article как microdata-«страховка» поверх JSON-LD: помогает
      // парсерам, которые JSON-LD ещё не научились читать.
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
          { name: post.title },
        ]}
      />

      <Link
        href="/blog"
        prefetch
        className="mt-6 inline-flex items-center gap-2 text-body-sm text-fg-muted hover:text-fg transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Все статьи
      </Link>

      <header className="mt-6 not-prose">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-fg-subtle">
          <time dateTime={post.date} itemProp="datePublished">
            {formatBlogDate(post.date)}
          </time>
          {post.updated && post.updated !== post.date ? (
            <span>
              · обновлено{" "}
              <time dateTime={post.updated} itemProp="dateModified">
                {formatBlogDate(post.updated)}
              </time>
            </span>
          ) : null}
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>~ {reading.minutes} мин чтения</span>
          </span>
        </div>
        <h1
          className="mt-4 text-h1 font-bold text-fg leading-tight text-balance blog-speakable-headline"
          itemProp="headline"
        >
          {post.title}
        </h1>
        <p
          className="mt-4 text-body lg:text-body-lg text-fg-muted leading-relaxed blog-speakable-summary"
          itemProp="description"
        >
          {post.description}
        </p>
        {/* Невидимое поле URL для микроданных — даёт парсерам каноничный адрес. */}
        <link itemProp="mainEntityOfPage" href={`${siteUrl}/blog/${post.slug}`} />
        {post.tags.length > 0 ? (
          <ul
            className="mt-6 flex flex-wrap gap-1.5"
            aria-label="Теги статьи"
          >
            {post.tags.map((t) => (
              <li
                key={t}
                className="inline-flex items-center rounded-full bg-bg-subtle px-3 py-1 text-caption text-fg-muted"
                itemProp="keywords"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {/* Программная «обложка» — градиент + крупный заголовок. */}
      <div
        className="mt-10 flex h-48 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] sm:h-64"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-grad-from) 0%, var(--brand-grad-to) 100%)",
        }}
        aria-hidden="true"
      >
        <p className="px-8 text-center text-h2 font-bold text-white text-balance leading-tight line-clamp-3">
          {post.title}
        </p>
      </div>

      <TableOfContents items={headings} />

      <div className="mt-2" itemProp="articleBody">
        <MDXRemote source={post.body} components={mdxComponents} />
        {!hasInlineEndCTA ? (
          <EndCTA>
            Поможем разобраться с задачей и довести её до запуска. Бесплатная оценка и ТЗ — в течение рабочего дня.
          </EndCTA>
        ) : null}
      </div>

      <RelatedPosts items={related} />
    </article>
  );
}
