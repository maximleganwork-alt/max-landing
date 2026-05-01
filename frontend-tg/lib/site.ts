import type { LegalSiteConfig } from "shared/components/legal/types";
import { resolveSiteUrl, type SiteMetaConfig } from "shared/lib/site-meta";

/**
 * Per-site config for frontend-tg (Telegram bots landing).
 */
export interface SiteConfig extends LegalSiteConfig, SiteMetaConfig {
  metaDescription: string;
}

const SITE_URL = resolveSiteUrl();

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "tg.example.ru",
  source: "tg",
  purpose: "разработка чат-ботов и AI-решений для мессенджера Telegram",
  siteUrl: SITE_URL,
  siteName: "Legan Studio",
  title:
    "Разработка ботов для Telegram под ключ — AI, Mini Apps, оплаты | Legan Studio",
  ogTitle: "Разработка ботов для Telegram под ключ",
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и Telegram Mini Apps. Опыт 5+ лет, 80+ ботов в продакшене, гарантия. Оценка и ТЗ — бесплатно. Цены от 15 000 ₽.",
  ogDescription:
    "Чат-боты, AI и Mini Apps внутри Telegram. Опыт 5+ лет, гарантия 30 дней.",
  metaDescription:
    "Студия разработки чат-ботов, AI-ассистентов и мини-приложений для Telegram",
  serviceType: "Разработка чат-бота для Telegram",
  keywords: [
    "разработка ботов для Telegram",
    "разработка чат-ботов Telegram",
    "Telegram Mini App",
    "Telegram WebApp",
    "заказать бота для Telegram",
    "AI бот Telegram",
    "GPT бот Telegram",
    "Telegram Stars оплаты",
    "оплаты Telegram",
    "интеграция Telegram с CRM",
    "интеграция Telegram с amoCRM",
    "интеграция Telegram с Битрикс24",
    "интеграция Telegram с 1С",
    "чат-бот для бизнеса Telegram",
    "корпоративный бот Telegram",
    "разработка ботов под ключ",
  ],
  sameAs: ["https://t.me/legan_studio"],
  themeColor: "#229ED9",
};
