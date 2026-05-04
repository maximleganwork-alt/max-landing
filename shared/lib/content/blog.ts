/**
 * Frontmatter блог-поста (MDX). Дата хранится строкой (`YYYY-MM-DD`),
 * чтобы не возиться с тайм-зонами при чтении из gray-matter.
 */
export interface BlogPostFrontmatter {
  /** Заголовок (H1) — также используется в <title>, OG, JSON-LD. */
  title: string;
  /** Лид/описание для карточки и meta description. 130–180 символов. */
  description: string;
  /** Дата публикации в формате YYYY-MM-DD. */
  date: string;
  /** Дата последнего обновления (опционально). */
  updated?: string;
  /** Теги — на русском, для фильтра и BlogPosting.keywords. */
  tags: string[];
  /** Если задано — пропускаем сборку этой статьи. */
  draft?: boolean;
}

/** Загруженный пост со слугом и (в большинстве случаев) скомпилированным телом. */
export interface BlogPost extends BlogPostFrontmatter {
  /** URL-сегмент: /blog/<slug>. */
  slug: string;
  /** Сырое содержимое MDX без frontmatter (для compileMDX). */
  body: string;
}

/** Краткая выжимка для карточек/sitemap — без тяжёлого тела MDX. */
export type BlogPostSummary = Omit<BlogPost, "body">;
