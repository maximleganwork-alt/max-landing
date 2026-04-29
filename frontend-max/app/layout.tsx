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
    default: "Разработка ботов для MAX под ключ — AI, мини-приложения, интеграции | BotMax",
    template: "%s | BotMax",
  },
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и мини-приложения для мессенджера MAX. Опыт 5+ лет, 50+ проектов, гарантия. Оценка и ТЗ — бесплатно. Цены от 15 000 ₽.",
  applicationName: "BotMax",
  authors: [{ name: "BotMax" }],
  keywords: [
    "разработка ботов для MAX",
    "разработка чат-ботов MAX",
    "бот для MAX мессенджера",
    "заказать бота для MAX",
    "AI бот MAX",
    "мини-приложение MAX",
    "интеграция MAX с CRM",
    "чат-бот для бизнеса MAX",
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
    title: "Разработка ботов для MAX под ключ",
    description:
      "Чат-боты, AI и мини-приложения внутри MAX. Опыт 5+ лет, гарантия 30 дней.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Разработка ботов для MAX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Разработка ботов для MAX под ключ",
    description: "Чат-боты, AI и мини-приложения внутри MAX. Опыт 5+ лет, гарантия 30 дней.",
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
