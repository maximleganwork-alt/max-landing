import type { LegalSiteConfig } from "shared/components/legal/types";

/**
 * Per-site config for frontend-web (web development landing).
 */
export interface SiteConfig extends LegalSiteConfig {
  source: "max" | "tg" | "web";
  metaDescription: string;
  serviceType: string;
}

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "web.example.ru",
  source: "web",
  purpose: "разработка сайтов, CRM/ERP-систем и веб-сервисов под ключ",
  metaDescription:
    "Студия веб-разработки: лендинги, корпоративные сайты, e-commerce, CRM, ERP, SaaS-сервисы",
  serviceType: "Разработка веб-приложения",
};
