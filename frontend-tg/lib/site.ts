import type { LegalSiteConfig } from "shared/components/legal/types";

/**
 * Per-site config for frontend-tg (Telegram bots landing).
 */
export interface SiteConfig extends LegalSiteConfig {
  source: "max" | "tg" | "web";
  metaDescription: string;
  serviceType: string;
}

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "tg.example.ru",
  source: "tg",
  purpose: "разработка чат-ботов и AI-решений для мессенджера Telegram",
  metaDescription:
    "Студия разработки чат-ботов, AI-ассистентов и мини-приложений для Telegram",
  serviceType: "Разработка чат-бота для Telegram",
};
