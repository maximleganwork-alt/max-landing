import { ImageResponse } from "next/og";
import type { SiteMetaConfig } from "./site-meta";

export const ogImageContentType = "image/png";
export const ogImageSize = { width: 1200, height: 630 };
// NOTE: each frontend must inline `export const runtime = "edge"` in its own
// opengraph-image / twitter-image file — Next does static analysis on this
// segment config and rejects identifiers imported from other modules.

const sourceLabels: Record<SiteMetaConfig["source"], string> = {
  max: "MAX",
  tg: "Telegram",
  web: "Web",
};

/**
 * Fetch Inter Cyrillic + Latin glyphs from Google Fonts CSS API.
 *
 * `next/og` renders with Satori, whose default font has no Cyrillic glyphs —
 * Russian text would render as boxes. We resolve a TTF URL from the CSS
 * stylesheet and cache it module-level so warm edge workers reuse it.
 */
let fontCache: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;

async function loadInterFonts() {
  if (!fontCache) {
    fontCache = (async () => {
      const cssUrl =
        "https://fonts.googleapis.com/css2?family=Inter:wght@600;800&subset=cyrillic&display=swap";
      // Old WebKit UA forces Google Fonts to return raw TTF URLs (not WOFF2,
      // which Satori cannot decode without Brotli, and not EOT).
      const cssRes = await fetch(cssUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.10",
        },
      });
      const css = await cssRes.text();
      // Cyrillic subset is served as WOFF1 (magic `wOFF`) which Satori supports;
      // Latin-only would be TTF. We accept both — Satori rejects only WOFF2.
      const matches = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map(
        (m) => m[1],
      );
      if (matches.length < 2) {
        throw new Error(
          "Could not resolve Inter font URLs from Google Fonts CSS",
        );
      }
      // CSS lists @font-face blocks in declaration order: weight 600 then 800.
      const regularUrl = matches[0];
      const boldUrl = matches[matches.length - 1];
      const [regular, bold] = await Promise.all([
        fetch(regularUrl).then((r) => r.arrayBuffer()),
        fetch(boldUrl).then((r) => r.arrayBuffer()),
      ]);
      return { regular, bold };
    })().catch((err) => {
      fontCache = null;
      throw err;
    });
  }
  return fontCache;
}

/**
 * Render a dynamic Open Graph card from the site config. The image follows the
 * brand palette (themeColor → gradient) and prints the OG title + brand label.
 *
 * Renders at the edge runtime via next/og so cold-start latency is low and we
 * don't ship a binary OG asset per landing.
 */
export async function renderSiteOgImage(config: SiteMetaConfig) {
  const sourceLabel = sourceLabels[config.source];
  const accent = config.themeColor;
  const fonts = await loadInterFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, #0d1424 0%, #1a2340 60%, ${accent} 140%)`,
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${accent} 0%, #8B5CF6 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              boxShadow: `0 12px 32px ${accent}40`,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {config.siteName}
            </span>
            <span style={{ fontSize: 18, color: "#94a3b8", marginTop: 2 }}>
              Студия разработки · {sourceLabel}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 800,
              margin: 0,
              maxWidth: 980,
            }}
          >
            {config.ogTitle}
          </h1>
          <p
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "#cbd5e1",
              margin: 0,
              maxWidth: 980,
              fontWeight: 600,
            }}
          >
            {config.ogDescription}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#cbd5e1",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 24,
            fontWeight: 600,
          }}
        >
          <span>{config.domain}</span>
          <span style={{ color: accent }}>Опыт 5+ лет · Гарантия 30 дней</span>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Inter", data: fonts.regular, weight: 600, style: "normal" },
        { name: "Inter", data: fonts.bold, weight: 800, style: "normal" },
      ],
    },
  );
}
