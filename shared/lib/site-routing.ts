import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "./site-meta";
import type { BlogPostSummary } from "./content/blog";

/**
 * Build a Next sitemap covering the home page and the legal documents.
 * Each frontend re-exports this from `app/sitemap.ts`.
 */
export function buildSiteSitemap(siteUrl?: string): MetadataRoute.Sitemap {
  const url = siteUrl ?? resolveSiteUrl();
  const now = new Date();
  return [
    {
      url: `${url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${url}/consent`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${url}/offer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

/**
 * Sitemap entries for `/blog` (index) and every published `/blog/<slug>`.
 * Index is rebuilt weekly, posts — monthly. Last-mod берётся из frontmatter.
 *
 * Priority дифференцирован по свежести: пост, обновлённый за последние
 * 30 дней, получает 0.9; до 180 дней — 0.7; старее — 0.5. Это влияет
 * на crawl-budget Yandex/Google и подсказывает им, что свежий контент
 * стоит переобходить чаще.
 */
export function buildBlogSitemap(
  siteUrl: string,
  posts: BlogPostSummary[],
): MetadataRoute.Sitemap {
  if (posts.length === 0) return [];
  const latest = posts.reduce(
    (acc, p) => (p.updated ?? p.date) > acc ? (p.updated ?? p.date) : acc,
    posts[0].updated ?? posts[0].date,
  );

  const now = Date.now();
  const DAY = 86_400_000;

  return [
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(latest),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((p) => {
      const lastMod = p.updated ?? p.date;
      const ageDays = Math.max(0, (now - new Date(lastMod).getTime()) / DAY);
      const priority = ageDays < 30 ? 0.9 : ageDays < 180 ? 0.7 : 0.5;
      const changeFrequency = ageDays < 30 ? "weekly" : ageDays < 365 ? "monthly" : "yearly";
      return {
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: new Date(lastMod),
        changeFrequency: changeFrequency as "weekly" | "monthly" | "yearly",
        priority,
      };
    }),
  ];
}

/**
 * Build a robots.txt with explicit rules for the major search engines and a
 * curated list of AI-content crawlers.
 *
 * - `/api/` and `/_next/static/chunks/` (best-effort) are blocked.
 * - Yandex / Google get explicit "follow everything" rules so the default `*`
 *   block doesn't accidentally apply.
 * - AI crawlers (GPTBot, ClaudeBot, Google-Extended, …) are allowed by default
 *   so the studio can be cited; the studio can revoke this by editing this
 *   file in one place.
 */
export function buildSiteRobots(siteUrl?: string): MetadataRoute.Robots {
  const url = siteUrl ?? resolveSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/static/chunks/"],
      },
      {
        userAgent: ["Googlebot", "Googlebot-Image", "Googlebot-News"],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["Yandex", "YandexBot", "YandexImages"],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI / content-aggregator crawlers — allow citation by default.
      // Список выровнен с публичной документацией каждого вендора (2025/2026):
      // OpenAI, Anthropic, Google AI Overviews, Perplexity, Apple Intelligence,
      // ByteDance/TikTok (Bytespider), Common Crawl (CCBot — korpus для
      // обучения многих моделей), Diffbot, Amazon Alexa, Meta AI, You.com,
      // Cohere, Mistral. Если позже понадобится отозвать одного из них —
      // правка в этом файле, без расщепления robots.txt по сайтам.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Google-Extended",
          "PerplexityBot",
          "Perplexity-User",
          "Applebot",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
          "Diffbot",
          "Amazonbot",
          "Meta-ExternalAgent",
          "FacebookBot",
          "YouBot",
          "cohere-ai",
          "MistralAI-User",
          "DuckAssistBot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
      // Расширение Яндекса для специализированных агентов (YandexAdditional —
      // дополнительный обход для Нейро/AI; YandexRenderResourcesBot —
      // рендерит JS перед индексацией).
      {
        userAgent: [
          "YandexAdditional",
          "YandexAdditionalBot",
          "YandexRenderResourcesBot",
          "YandexNews",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
