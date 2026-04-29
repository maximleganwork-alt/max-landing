import type { HeroContent } from "shared/lib/content/hero";

export const heroContent: HeroContent = {
  heading: {
    before: "Боты для ",
    brand: "Telegram",
    after: ", которые приносят выручку",
  },
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и Telegram Mini Apps. Под ключ — от технического задания до запуска и поддержки. Опыт 5+ лет, реальные продажи внутри мессенджера.",
  primaryCta: "Обсудить проект",
  secondaryCta: "Смотреть тарифы",
  stats: [
    { value: 5, suffix: "+", label: "лет на рынке", animate: true },
    { value: 80, suffix: "+", label: "ботов в продакшене", animate: true },
    { value: 30, suffix: "+", label: "корпоративных клиентов", animate: true },
    { label: "поддержка", text: "24/7", animate: false },
  ],
};
