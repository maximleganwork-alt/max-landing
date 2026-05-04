import type { MetadataRoute } from "next";
import { buildSiteSitemap, buildBlogSitemap } from "shared/lib/site-routing";
import { resolveSiteUrl } from "shared/lib/site-meta";
import { casesContent } from "@/lib/content/cases";
import { getAllBlogSummaries } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = resolveSiteUrl();
  const now = new Date();
  return [
    ...buildSiteSitemap(url),
    ...casesContent.items.map((c) => ({
      url: `${url}/cases/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...buildBlogSitemap(url, getAllBlogSummaries()),
  ];
}
