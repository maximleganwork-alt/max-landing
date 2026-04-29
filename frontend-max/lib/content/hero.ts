import type { HeroContent } from "shared/lib/content/hero";

export const heroContent: HeroContent = {
  heading: {
    before: "Боты для ",
    brand: "MAX",
    after: ", которые работают на ваш бизнес",
  },
  description:
    "Разрабатываем чат-ботов, AI-ассистентов и мини-приложения внутри национального мессенджера MAX. Под ключ — от технического задания до запуска и поддержки.",
  primaryCta: "Обсудить проект",
  secondaryCta: "Смотреть тарифы",
  stats: [
    { value: 5, suffix: "+", label: "лет на рынке", animate: true },
    { value: 50, suffix: "+", label: "реализованных проектов", animate: true },
    { value: 20, suffix: "+", label: "корпоративных клиентов", animate: true },
    { label: "поддержка", text: "24/7", animate: false },
  ],
};
