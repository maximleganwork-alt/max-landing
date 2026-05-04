"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimateIn } from "../ui/AnimateIn";
import { BlogCard } from "./BlogCard";
import { cn } from "../../lib/utils";
import type { BlogPostSummary } from "../../lib/content/blog";
import { collectTopTags } from "../../lib/blog-utils";

interface BlogIndexProps {
  posts: BlogPostSummary[];
  /** Заголовок страницы. */
  title?: string;
  /** Лид под заголовком. */
  lead?: string;
}

// useLayoutEffect эквивалент, безопасный при SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SCROLL_THRESHOLD_PX = 400;
// Сколько чипов тегов показываем над сеткой — примерно три ряда на десктопе.
// Берём самые популярные по числу постов; остальное прячем, чтобы фильтр
// не превращался в «облако тегов» во весь экран.
const TAG_LIMIT = 27;

/**
 * Листинг блога: featured-карточка + сетка + чипы фильтра по тегам.
 * Фильтр клиентский — все посты прилетают сразу, без перезагрузок.
 */
export function BlogIndex({
  posts,
  title = "Блог",
  lead = "Разбираем популярные вопросы о разработке: коротко, по делу и без воды.",
}: BlogIndexProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // Если страницу перезагрузили на глубокой позиции (браузер восстановил
  // скролл вниз), пропускаем анимации — иначе пользователь ждёт каскад
  // и видит пустоту, пока очередь дойдёт до его карточки.
  const [skipAnim, setSkipAnim] = useState(false);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const getY = () =>
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    if (getY() > SCROLL_THRESHOLD_PX) {
      setSkipAnim(true);
      return;
    }

    // Браузер может восстанавливать скролл уже после первого layout-эффекта,
    // поэтому подстраховываемся: слушаем scroll и пингуем через таймауты,
    // фиксируем skipAnim, как только заметили глубокую позицию.
    let done = false;
    const finish = () => {
      if (done) return;
      if (getY() > SCROLL_THRESHOLD_PX) {
        done = true;
        setSkipAnim(true);
        cleanup();
      }
    };

    const onScroll = () => finish();
    window.addEventListener("scroll", onScroll, { passive: true });
    const t1 = window.setTimeout(finish, 50);
    const t2 = window.setTimeout(finish, 150);
    const t3 = window.setTimeout(finish, 300);
    const t4 = window.setTimeout(() => {
      done = true;
      cleanup();
    }, 600);

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    }

    return cleanup;
  }, []);

  const tags = useMemo(() => collectTopTags(posts, TAG_LIMIT), [posts]);
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, activeTag, trimmedQuery]);

  const [featured, ...rest] = filtered;

  return (
    <section className="container-narrow pb-20">
      <Reveal skip={skipAnim}>
        {/* max-w-none снимает дефолтные `max-w-3xl mx-auto` у центрированного
            SectionHeading — для блога заголовок и лид должны занимать всю
            ширину контейнера, а не сжиматься в узкую колонку. */}
        <SectionHeading title={title} lead={lead} className="max-w-none" />
      </Reveal>

      <Reveal skip={skipAnim} delay={0.03} className="mt-8 flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по статьям"
            aria-label="Поиск по статьям"
            className={cn(
              "w-full rounded-full border border-border bg-bg-card py-3 pl-12 pr-12 text-body text-fg",
              "placeholder:text-fg-subtle transition-colors",
              // Без обводки в фокусе — глобальный :focus-visible тоже снимаем.
              "focus:outline-none focus-visible:outline-none",
              // у некоторых браузеров search-input рисует свой ×; убираем,
              // чтобы не дублировать нашу кнопку очистки.
              "[&::-webkit-search-cancel-button]:hidden",
            )}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Очистить поиск"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle hover:bg-bg-subtle hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </Reveal>

      {tags.length > 0 ? (
        <Reveal skip={skipAnim} delay={0.05} className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <TagChip
            label="Все"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((t) => (
            <TagChip
              key={t}
              label={t}
              active={activeTag === t}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            />
          ))}
        </Reveal>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-body text-fg-subtle">
          {trimmedQuery
            ? `По запросу «${trimmedQuery}» ничего не нашли.`
            : "По выбранному тегу пока ничего нет."}
        </p>
      ) : (
        // Без key на сетке: AnimateIn у каждой карточки независим (своя
        // viewport-проверка с once: true), а ремонт сетки при флипе skipAnim
        // ломает scroll restoration — контент кратко схлопывается, и из-за
        // глобального `scroll-behavior: smooth` страница плавно уезжает.
        <div
          className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr lg:gap-6"
        >
          {featured ? (
            <RevealCard
              key={featured.slug}
              skip={skipAnim}
              idx={0}
              className="sm:col-span-2 lg:col-span-3"
            >
              <BlogCard post={featured} variant="featured" />
            </RevealCard>
          ) : null}
          {rest.map((post, idx) => (
            <RevealCard
              key={post.slug}
              skip={skipAnim}
              idx={featured ? idx + 1 : idx}
            >
              <BlogCard post={post} variant="default" />
            </RevealCard>
          ))}
        </div>
      )}
    </section>
  );
}

// Каскад только в первых ~5 карточках, дальше задержка плоская и небольшая —
// даже если детектор скролла не сработает, ждать > 0.2s никто не будет.
const cardDelay = (idx: number) => Math.min(idx, 4) * 0.05;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Если true — рендерим plain `<div>`, без motion. */
  skip: boolean;
}

/**
 * Обёртка для статичных секций (заголовок, поиск, чипы). Определена на
 * уровне модуля — иначе на каждом рендере родителя это будет новая
 * функция-компонент, и React пересоздаст всё внутри (включая `<input>`,
 * который теряет фокус после первой же буквы).
 */
function Reveal({ children, className, delay, skip }: RevealProps) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <AnimateIn className={className} delay={delay}>
      {children}
    </AnimateIn>
  );
}

interface RevealCardProps {
  children: ReactNode;
  className?: string;
  idx: number;
  skip: boolean;
}

function RevealCard({ children, className, idx, skip }: RevealCardProps) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <AnimateIn className={className} delay={cardDelay(idx)}>
      {children}
    </AnimateIn>
  );
}

interface TagChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TagChip({ label, active, onClick }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-body-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "border-transparent text-white"
          : "border-border bg-bg-card text-fg-muted hover:border-border-strong hover:text-fg",
      )}
      style={active ? { background: "var(--gradient-brand)" } : undefined}
    >
      {label}
    </button>
  );
}
