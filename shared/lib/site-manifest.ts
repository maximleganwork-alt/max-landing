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
    // PWA-install требует PNG-иконки 192×192 и 512×512. Раздаются динамически
    // через `app/icon-192.tsx` и `app/icon-512.tsx` (next/og рендерит PNG на
    // edge). SVG оставлен как primary для браузеров с vector-favicon support.
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      // Каждый размер дублируем как `any` + `maskable` — `any` идёт под фавикон/
      // splash, `maskable` — под адаптивные иконки Android (с safe-зоной 80%).
      // Один комбинированный entry "any maskable" не разрешён типами Next 15.
      {
        src: "/icon-192",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icon-192",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icon-512",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-512",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
