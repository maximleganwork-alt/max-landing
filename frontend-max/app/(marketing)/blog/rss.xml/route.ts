import { buildBlogRss } from "shared/lib/blog-rss";
import { resolveSiteUrl } from "shared/lib/site-meta";
import { siteConfig } from "@/lib/site";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  // Передаём полные тела постов — buildBlogRss конвертирует MDX → HTML
  // и складывает в `<content:encoded>`. AI-краулеры (GPTBot, ClaudeBot,
  // PerplexityBot) активно обходят RSS, и полнотекстовый фид заметно
  // повышает шансы цитирования в чат-ботах.
  const xml = buildBlogRss({
    siteUrl: resolveSiteUrl(),
    siteName: siteConfig.siteName,
    description: `Блог о разработке ботов для MAX — ${siteConfig.metaDescription}`,
    posts: getAllBlogPosts(),
  });
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
