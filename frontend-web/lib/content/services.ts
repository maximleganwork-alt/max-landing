import {
  Bot,
  Building2,
  Database,
  LayoutGrid,
  Plug,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import type { ServicesContent } from "shared/lib/content/services";

// Порядок важен: первая карточка = featured (2×2), шестая = wide (2×1) на lg
export const servicesContent: ServicesContent = {
  title: "Что мы разрабатываем",
  lead: "От одностраничных лендингов до сложных корпоративных систем. Полный цикл — от исследования до релиза, документации и поддержки.",
  items: [
    {
      icon: Bot,
      title: "AI-разработка",
      text: "Чат-боты, RAG-поиск по базе знаний, AI-агенты в вашем продукте. GPT, Claude, GigaChat, YandexGPT.",
    },
    {
      icon: Sparkles,
      title: "Лендинги",
      text: "Продающие одностраничники с фокусом на конверсию: A/B-тесты, аналитика, форма заявки.",
    },
    {
      icon: Building2,
      title: "Корпоративные сайты",
      text: "Многостраничные сайты для B2B: каталог, кейсы, вакансии, мультиязычность.",
    },
    {
      icon: ShoppingBag,
      title: "Интернет-магазины",
      text: "Каталог, корзина, оплата, доставка, личный кабинет. Интеграции с 1С и маркетплейсами.",
    },
    {
      icon: Users,
      title: "Личные кабинеты",
      text: "B2B-порталы и кабинеты пользователей: SSO-авторизация, роли, биллинг, отчёты и аналитика.",
    },
    {
      icon: LayoutGrid,
      title: "SaaS и веб-сервисы",
      text: "MVP за 4–8 недель и полноценные продукты: подписки, тарифы, мультитенантность, API.",
    },
    {
      icon: Database,
      title: "CRM и ERP",
      text: "Клиенты, сделки, склад, финансы. Автоматизация бизнеса. Интеграции с 1С, банками и маркетплейсами.",
    },
    {
      icon: Plug,
      title: "Интеграции",
      text: "1С, Битрикс24, amoCRM, СКУД, банковские API, СБП, Wildberries, Ozon — любые системы.",
    },
  ],
  cta: "Получить оценку",
};
