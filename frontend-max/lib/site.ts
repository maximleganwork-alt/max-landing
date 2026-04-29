import type { LegalSiteConfig } from "shared/components/legal/types";

/**
 * Per-site config for frontend-max (MAX-messenger bots landing).
 * `domain` and `purpose` are consumed by shared legal components.
 * `source` is the lead source identifier sent to the backend.
 * `metaDescription` and `serviceType` are consumed by JsonLd.
 */
export interface SiteConfig extends LegalSiteConfig {
  source: "max" | "tg" | "web";
  metaDescription: string;
  serviceType: string;
}

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "max.example.ru",
  source: "max",
  purpose: "разработка чат-ботов и AI-решений для мессенджера MAX",
  metaDescription:
    "Студия разработки ботов и мини-приложений для мессенджера MAX",
  serviceType: "Разработка чат-бота для MAX",
};
