import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "shared/components/Providers";
import { YandexMetrika } from "shared/components/analytics/YandexMetrika";
import { CookieBanner } from "shared/components/analytics/CookieBanner";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Веб-разработка под ключ — лендинги, сайты, CRM, ERP, SaaS | BotMax",
    template: "%s | BotMax",
  },
  description:
    "Разрабатываем сайты, e-commerce, CRM, ERP-системы и веб-сервисы. Опыт 5+ лет, фиксированные сроки и цена в договоре. Оценка и ТЗ — бесплатно. Цены от 40 000 ₽.",
  applicationName: "BotMax",
  authors: [{ name: "BotMax" }],
  keywords: [
    "разработка сайтов",
    "разработка веб-приложений",
    "разработка CRM",
    "разработка ERP",
    "интернет-магазин под ключ",
    "корпоративный сайт",
    "SaaS разработка",
    "заказать сайт",
  ],
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "BotMax",
    title: "Веб-разработка под ключ",
    description:
      "Сайты, CRM, ERP, SaaS-сервисы. Опыт 5+ лет, фикс цены в договоре, гарантия 30 дней.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Веб-разработка под ключ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Веб-разработка под ключ",
    description:
      "Сайты, CRM, ERP, SaaS-сервисы. Опыт 5+ лет, фикс цены в договоре, гарантия 30 дней.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
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
