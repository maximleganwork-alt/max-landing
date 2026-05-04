import { ImageResponse } from "next/og";
import type { SiteMetaConfig } from "./site-meta";

export const blogOgContentType = "image/png";
export const blogOgSize = { width: 1200, height: 630 };

const sourceLabels: Record<SiteMetaConfig["source"], string> = {
  max: "MAX",
  tg: "Telegram",
  web: "Web",
};

let fontCache: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;

async function loadInterFonts() {
  if (!fontCache) {
    fontCache = (async () => {
      const cssUrl =
        "https://fonts.googleapis.com/css2?family=Inter:wght@600;800&subset=cyrillic&display=swap";
      const cssRes = await fetch(cssUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.10",
        },
      });
      const css = await cssRes.text();
      const matches = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
      if (matches.length < 2) {
        throw new Error("Could not resolve Inter font URLs from Google Fonts CSS");
      }
      const [regular, bold] = await Promise.all([
        fetch(matches[0]).then((r) => r.arrayBuffer()),
        fetch(matches[matches.length - 1]).then((r) => r.arrayBuffer()),
      ]);
      return { regular, bold };
    })().catch((err) => {
      fontCache = null;
      throw err;
    });
  }
  return fontCache;
}

interface BlogOgArgs {
  config: SiteMetaConfig;
  /** Заголовок поста (или статичный «Блог» для листинга). */
  title: string;
  /** Подзаголовок: лид/описание. */
  description?: string;
  /** Метка-эйбро («Блог · MAX», «Статья» и т. п.). */
  eyebrow?: string;
}

/**
 * OG-карточка для страниц блога. Тот же градиент, что и у /opengraph-image,
 * но крупный заголовок поста занимает основную часть холста.
 */
export async function renderBlogOgImage({ config, title, description, eyebrow }: BlogOgArgs) {
  const sourceLabel = sourceLabels[config.source];
  const accent = config.themeColor;
  const fonts = await loadInterFonts();
  const eb = eyebrow ?? `${config.siteName} · ${sourceLabel}`;

  // Подрезаем длинные заголовки — Satori не делает ellipsis, поэтому режем сами.
  const cappedTitle = title.length > 96 ? `${title.slice(0, 95)}…` : title;
  const cappedDescription =
    description && description.length > 180 ? `${description.slice(0, 179)}…` : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
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
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {config.siteName}
            </span>
            <span style={{ fontSize: 18, color: "#94a3b8", marginTop: 2 }}>{eb}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
          <h1
            style={{
              fontSize: cappedTitle.length > 60 ? 56 : 64,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 800,
              margin: 0,
              maxWidth: 1040,
            }}
          >
            {cappedTitle}
          </h1>
          {cappedDescription ? (
            <p
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "#cbd5e1",
                margin: 0,
                maxWidth: 1040,
                fontWeight: 600,
              }}
            >
              {cappedDescription}
            </p>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#cbd5e1",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 20,
            fontWeight: 600,
          }}
        >
          <span>{config.domain}/blog</span>
          <span style={{ color: accent }}>Заказать разработку →</span>
        </div>
      </div>
    ),
    {
      ...blogOgSize,
      fonts: [
        { name: "Inter", data: fonts.regular, weight: 600, style: "normal" },
        { name: "Inter", data: fonts.bold, weight: 800, style: "normal" },
      ],
    },
  );
}
