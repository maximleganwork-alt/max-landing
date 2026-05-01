import type { Metadata, Viewport } from "next";
import { Inter, Michroma } from "next/font/google";
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

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-michroma",
});

export const metadata: Metadata = buildSiteMetadata({ config: siteConfig });

export const viewport: Viewport = buildSiteViewport(siteConfig);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru-RU" className={`${inter.variable} ${michroma.variable}`}>
      <head>
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
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
