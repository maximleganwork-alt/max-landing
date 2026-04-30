import type { MetadataRoute } from "next";
import type { SiteMetaConfig } from "./site-meta";

/**
 * Build a Web App Manifest from per-site metadata. Used by `app/manifest.ts` on
 * each frontend so a single edit to the SiteConfig propagates everywhere.
 */
export function buildSiteManifest(config: SiteMetaConfig): MetadataRoute.Manifest {
  return {
    name: `${config.siteName} — ${config.ogTitle}`,
    short_name: config.siteName,
    description: config.ogDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: config.themeColor,
    lang: "ru-RU",
    dir: "ltr",
    categories: ["business", "productivity", "developer"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
