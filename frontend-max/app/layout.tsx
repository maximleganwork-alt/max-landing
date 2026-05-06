import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "shared/components/Providers";
import { YandexMetrika } from "shared/components/analytics/YandexMetrika";
import { CookieBanner } from "shared/components/analytics/CookieBanner";
import { buildSiteMetadata, buildSiteViewport } from "shared/lib/site-meta";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});


export const metadata: Metadata = buildSiteMetadata({ config: siteConfig });

export const viewport: Viewport = buildSiteViewport(siteConfig);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru-RU" className={`${inter.variable}`}>
      <head>
        {/* SmartCaptcha — необходимая антиспам-защита, грузится без согласия.
            Yandex.Metrika preconnect перенесён в YandexMetrika.tsx и срабатывает
            только после accept в cookie-баннере. */}
        <link rel="preconnect" href="https://smartcaptcha.yandexcloud.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://smartcaptcha.yandexcloud.net" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Перейти к контенту
        </a>
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
        <YandexMetrika />
      </body>
    </html>
  );
}
