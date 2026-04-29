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
    default: "Разработка ботов для Telegram под ключ — AI, Mini Apps, оплаты | BotMax",
    template: "%s | BotMax",
  },
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и Telegram Mini Apps. Опыт 5+ лет, 80+ ботов в продакшене, гарантия. Оценка и ТЗ — бесплатно. Цены от 15 000 ₽.",
  applicationName: "BotMax",
  authors: [{ name: "BotMax" }],
  keywords: [
    "разработка ботов для Telegram",
    "разработка чат-ботов Telegram",
    "Telegram Mini App",
    "заказать бота для Telegram",
    "AI бот Telegram",
    "Telegram Stars оплаты",
    "интеграция Telegram с CRM",
    "чат-бот для бизнеса Telegram",
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
    title: "Разработка ботов для Telegram под ключ",
    description:
      "Чат-боты, AI и Mini Apps внутри Telegram. Опыт 5+ лет, гарантия 30 дней.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Разработка ботов для Telegram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Разработка ботов для Telegram под ключ",
    description: "Чат-боты, AI и Mini Apps внутри Telegram. Опыт 5+ лет, гарантия 30 дней.",
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
