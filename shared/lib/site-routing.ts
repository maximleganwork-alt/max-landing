import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "./site-meta";

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
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "PerplexityBot",
          "Applebot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
