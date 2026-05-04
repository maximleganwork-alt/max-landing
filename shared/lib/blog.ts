import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostFrontmatter, BlogPostSummary } from "./content/blog";

/**
 * Server-only утилиты: чтение MDX-постов с диска. Импортироваться могут
 * только из RSC во время SSG (build-time). На клиент эти функции не
 * затягиваются благодаря `import "server-only"` — Next.js падает с понятной
 * ошибкой, если кто-то случайно импортирует это в client component.
 *
 * Чистые функции (formatBlogDate, collectTags, findRelatedPosts) живут в
 * `./blog-utils.ts` — их можно использовать с обеих сторон.
 */

/** Прочитать все `.mdx` файлы из директории и вернуть массив постов с телом. */
export function readBlogPosts(blogDir: string): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  const posts: BlogPost[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as Partial<BlogPostFrontmatter>;
    if (fm.draft) continue;
    if (!fm.title || !fm.description || !fm.date) {
      throw new Error(
        `Blog post ${file}: required frontmatter (title/description/date) is missing.`,
      );
    }
    posts.push({
      slug,
      title: fm.title,
      description: fm.description,
      date: fm.date,
      updated: fm.updated,
      tags: fm.tags ?? [],
      body: content,
    });
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** То же, но без тела — дешевле для листинга / sitemap / RSS. */
export function readBlogSummaries(blogDir: string): BlogPostSummary[] {
  return readBlogPosts(blogDir).map(({ body, ...rest }) => {
    void body;
    return rest;
  });
}

/** Найти один пост по слугу (для `app/blog/[slug]/page.tsx`). */
export function findBlogPost(blogDir: string, slug: string): BlogPost | null {
  const file = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<BlogPostFrontmatter>;
  if (fm.draft) return null;
  if (!fm.title || !fm.description || !fm.date) return null;
  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    tags: fm.tags ?? [],
    body: content,
  };
}

// Re-export client-safe utils so existing call sites keep working.
export {
  formatBlogDate,
  collectTags,
  collectTopTags,
  findRelatedPosts,
  slugifyHeading,
  extractPostHeadings,
  estimateReadingTime,
  mdxToRssHtml,
  extractFaqEntries,
} from "./blog-utils";
