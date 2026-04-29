import type { HeroContent } from "shared/lib/content/hero";

export const heroContent: HeroContent = {
  heading: {
    before: "Сайты, ",
    brand: "сервисы и системы",
    after: ", которые работают на бизнес",
  },
  description:
    "Разрабатываем веб-проекты под ключ: лендинги, корпоративные сайты, e-commerce, CRM, ERP, SaaS-сервисы. От технического задания до запуска и поддержки.",
  primaryCta: "Обсудить проект",
  secondaryCta: "Смотреть тарифы",
  stats: [
    { value: 5, suffix: "+", label: "лет на рынке", animate: true },
    { value: 120, suffix: "+", label: "проектов в продакшене", animate: true },
    { value: 30, suffix: "+", label: "корпоративных клиентов", animate: true },
    { label: "поддержка", text: "24/7", animate: false },
  ],
};
