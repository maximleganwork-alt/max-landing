import type { LegalSiteConfig } from "shared/components/legal/types";
import { resolveSiteUrl, type SiteMetaConfig } from "shared/lib/site-meta";

/**
 * Per-site config for frontend-web (web development landing).
 */
export interface SiteConfig extends LegalSiteConfig, SiteMetaConfig {
  metaDescription: string;
}

const SITE_URL = resolveSiteUrl();

// ⚠️ domain — заглушка. Заменить на реальный домен перед публикацией.
export const siteConfig: SiteConfig = {
  domain: "web.example.ru",
  source: "web",
  purpose: "разработка сайтов, CRM/ERP-систем и веб-сервисов под ключ",
  siteUrl: SITE_URL,
  siteName: "Legan Studio",
  title: "Веб-разработка под ключ — лендинги, сайты, CRM, ERP, SaaS | Legan Studio",
  ogTitle: "Веб-разработка под ключ",
  description:
    "Разрабатываем сайты, e-commerce, CRM, ERP-системы и веб-сервисы. Опыт 5+ лет, фиксированные сроки и цена в договоре. Оценка и ТЗ — бесплатно. Цены от 40 000 ₽.",
  ogDescription:
    "Сайты, CRM, ERP, SaaS-сервисы. Опыт 5+ лет, фикс цены в договоре, гарантия 30 дней.",
  metaDescription:
    "Студия веб-разработки: лендинги, корпоративные сайты, e-commerce, CRM, ERP, SaaS-сервисы",
  serviceType: "Разработка веб-приложения",
  keywords: [
    "разработка сайтов",
    "разработка веб-приложений",
    "разработка CRM",
    "разработка ERP",
    "разработка SaaS",
    "интернет-магазин под ключ",
    "корпоративный сайт",
    "лендинг под ключ",
    "разработка лендинга",
    "разработка интернет-магазина",
    "Next.js разработка",
    "React разработка",
    "MVP за 4 недели",
    "веб-разработка под ключ",
    "интеграция 1С",
    "заказать сайт",
    "веб-студия",
  ],
  sameAs: ["https://t.me/legan_studio"],
  themeColor: "#5B8DFF",
};
