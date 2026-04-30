import type { MetadataRoute } from "next";
import { buildSiteSitemap } from "shared/lib/site-routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSiteSitemap();
}
