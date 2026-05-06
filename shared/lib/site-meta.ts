import type { Metadata, Viewport } from "next";

/**
 * Shared SEO config consumed by `buildSiteMetadata` and the JSON-LD component.
 * Each frontend extends this in its own `lib/site.ts`.
 */
export interface SiteMetaConfig {
  /** Bare hostname without scheme, e.g. "max.example.ru". */
  domain: string;
  /** Lead-source identifier (also used for og:image text). */
  source: "max" | "tg" | "web";
  /** Canonical absolute origin, e.g. "https://max.example.ru". */
  siteUrl: string;
  /** Brand name shown in og:site_name and JSON-LD. */
  siteName: string;
  /** Default <title>. */
  title: string;
  /** Short title used in OG/Twitter cards. */
  ogTitle: string;
  /** Default <meta name="description">. */
  description: string;
  /** Short description for OG/Twitter cards. */
  ogDescription: string;
  /** Long-tail keyword set (RU). */
  keywords: string[];
  /** Schema.org "Service" serviceType label, e.g. "Разработка чат-бота для MAX". */
  serviceType: string;
  /** Public profile URLs (used as schema.org sameAs). Empty during dev. */
  sameAs?: string[];
  /** Theme color matched to the site palette (CSS hex). */
  themeColor: string;
  /** Twitter handle without "@" — fallback to siteName if absent. */
  twitterHandle?: string;
}

const SITE_URL_FALLBACK = "https://example.ru";

export function resolveSiteUrl(envUrl?: string): string {
  return (envUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK).replace(/\/+$/, "");
}

interface BuildMetaArgs {
  config: SiteMetaConfig;
  /** Override siteUrl (otherwise read from config / env). */
  siteUrl?: string;
}

/**
 * Build a Next `Metadata` object for the root layout of a landing.
 *
 * Centralises:
 *   - canonical + metadataBase
 *   - rich Open Graph + Twitter cards
 *   - Russian-specific robots tweaks (Yandex, max-image-preview)
 *   - apple-touch-icon + manifest
 *   - search engine verification (driven by env vars)
 */
export function buildSiteMetadata({ config, siteUrl }: BuildMetaArgs): Metadata {
  const url = siteUrl ?? config.siteUrl;
  const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

  return {
    metadataBase: new URL(url),
    title: {
      default: config.title,
      template: `%s | ${config.siteName}`,
    },
    description: config.description,
    applicationName: config.siteName,
    authors: [{ name: config.siteName, url }],
    creator: config.siteName,
    publisher: config.siteName,
    keywords: config.keywords,
    referrer: "origin-when-cross-origin",
    category: "technology",
    alternates: {
      canonical: "/",
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // `app/opengraph-image.tsx` отдаётся Next под URL `/opengraph-image`
    // (БЕЗ `.png` — расширение даёт 404). На главной Next дополнительно
    // добавляет ?hash для cache-busting; для дочерних страниц мы прописываем
    // тот же путь руками — иначе Next не наследует og:image вверх по дереву.
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: `${url}/`,
      siteName: config.siteName,
      title: config.ogTitle,
      description: config.ogDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: config.ogTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: config.twitterHandle ? `@${config.twitterHandle}` : undefined,
      creator: config.twitterHandle ? `@${config.twitterHandle}` : undefined,
      title: config.ogTitle,
      description: config.ogDescription,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
      "max-image-preview": "large",
    },
    // Иконки: `app/icon.tsx` и `app/apple-icon.tsx` подхватываются Next.js
    // автоматически (32×32 favicon + 180×180 apple-touch-icon). Доп. ставим
    // `/icon.svg` из public — браузеры предпочитают SVG когда доступен.
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: config.siteName,
      statusBarStyle: "default",
    },
    verification: {
      ...(yandexVerification ? { yandex: yandexVerification } : {}),
      ...(googleVerification ? { google: googleVerification } : {}),
    },
  };
}

export function buildSiteViewport(config: SiteMetaConfig): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: config.themeColor },
      { media: "(prefers-color-scheme: dark)", color: config.themeColor },
    ],
    colorScheme: "light",
  };
}
