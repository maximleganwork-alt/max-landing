import type { BlogPostSummary, BlogPost } from "./content/blog";
import { mdxToRssHtml } from "./blog-utils";

interface BuildRssArgs {
  siteUrl: string;
  siteName: string;
  description: string;
  /**
   * Посты для фида. Если переданы тела (`BlogPost`) — в `<content:encoded>`
   * попадает полный HTML-рендер; иначе только `<description>`. AI-краулеры
   * (GPTBot, ClaudeBot, PerplexityBot) активно обходят RSS, и полный текст
   * заметно повышает шансы цитирования.
   */
  posts: BlogPostSummary[] | BlogPost[];
}

/** Минималистичная экранизация под XML — экранируем 5 «ядовитых» символов. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Безопасное оборачивание HTML в CDATA для `<content:encoded>`. */
function wrapCdata(html: string): string {
  // RSS не позволяет вложенные `]]>` — разрезаем их.
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function hasBody(p: BlogPostSummary | BlogPost): p is BlogPost {
  return typeof (p as BlogPost).body === "string";
}

/**
 * Сборка RSS 2.0 фида со списком всех постов. Поскольку фид раздаётся
 * статически (`force-static`), передавать через CDN/nginx-кэш безопасно.
 *
 * Namespace `content:` подключён даже когда тел нет — это валидно и не
 * мешает ридерам, плюс можно добавить content:encoded позже без миграций.
 */
export function buildBlogRss({ siteUrl, siteName, description, posts }: BuildRssArgs): string {
  const lastBuild =
    (posts[0] && (posts[0].updated ?? posts[0].date)) ?? new Date().toISOString();
  // Группируем посты по дате публикации, чтобы внутри одного дня каждому
  // выдать уникальную минуту — иначе фид-ридеры показывают их в случайном
  // порядке. Сортировка стабильная: posts уже идут по дате убыванию,
  // внутри даты — по индексу. Свежий пост в этой группе получает 09:00,
  // следующий — 08:59, потом 08:58 и т. д.
  const dayCounter = new Map<string, number>();
  const items = posts
    .map((p) => {
      const idx = dayCounter.get(p.date) ?? 0;
      dayCounter.set(p.date, idx + 1);
      const minutes = Math.max(0, 60 - idx).toString().padStart(2, "0");
      const url = `${siteUrl}/blog/${p.slug}`;
      const pubDate = new Date(`${p.date}T08:${minutes}:00Z`).toUTCString();
      const tags = p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("");
      const contentEncoded = hasBody(p)
        ? `\n      <content:encoded>${wrapCdata(mdxToRssHtml(p.body, siteUrl))}</content:encoded>`
        : "";
      const updated = p.updated
        ? `\n      <atom:updated>${new Date(`${p.updated}T08:00:00Z`).toISOString()}</atom:updated>`
        : "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>${updated}
      <description>${escapeXml(p.description)}</description>
      ${tags}${contentEncoded}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`Блог · ${siteName}`)}</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>${escapeXml(description)}</description>
    <language>ru-RU</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/blog/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
