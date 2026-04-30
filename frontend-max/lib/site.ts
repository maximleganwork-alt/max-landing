import type { LegalSiteConfig } from "shared/components/legal/types";
import { resolveSiteUrl, type SiteMetaConfig } from "shared/lib/site-meta";

/**
 * Per-site config for frontend-max (MAX-messenger bots landing).
 * `domain` and `purpose` are consumed by shared legal components.
 * `source` is the lead source identifier sent to the backend.
 * The remaining fields are consumed by the shared metadata builder + JSON-LD.
 */
export interface SiteConfig extends LegalSiteConfig, SiteMetaConfig {
  /** Short copy for footer/JSON-LD descriptions (was metaDescription). */
  metaDescription: string;
}

const SITE_URL = resolveSiteUrl();

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "max.example.ru",
  source: "max",
  purpose: "разработка чат-ботов и AI-решений для мессенджера MAX",
  siteUrl: SITE_URL,
  siteName: "BotMax",
  title:
    "Разработка ботов для MAX под ключ — AI, мини-приложения, интеграции | BotMax",
  ogTitle: "Разработка ботов для MAX под ключ",
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и мини-приложения для мессенджера MAX. Опыт 5+ лет, 50+ проектов, гарантия. Оценка и ТЗ — бесплатно. Цены от 15 000 ₽.",
  ogDescription:
    "Чат-боты, AI и мини-приложения внутри MAX. Опыт 5+ лет, гарантия 30 дней.",
  metaDescription:
    "Студия разработки ботов и мини-приложений для мессенджера MAX",
  serviceType: "Разработка чат-бота для MAX",
  keywords: [
    "разработка ботов для MAX",
    "разработка чат-ботов MAX",
    "бот для MAX мессенджера",
    "заказать бота для MAX",
    "AI бот MAX",
    "мини-приложение MAX",
    "мини-приложения MAX мессенджер",
    "интеграция MAX с CRM",
    "интеграция MAX с 1С",
    "чат-бот для бизнеса MAX",
    "корпоративный бот MAX",
    "разработка ботов под ключ",
    "GigaChat бот MAX",
    "GPT бот MAX",
    "национальный мессенджер MAX",
  ],
  sameAs: [],
  themeColor: "#5B8DFF",
};
