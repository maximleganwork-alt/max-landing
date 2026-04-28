import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { CookieBanner } from "@/components/analytics/CookieBanner";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored;
    if (!theme || theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
