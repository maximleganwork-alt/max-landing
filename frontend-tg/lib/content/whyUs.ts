import {
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import type { WhyUsContent } from "shared/lib/content/whyUs";

export const whyUsContent: WhyUsContent = {
  title: "Почему выбирают нас",
  lead: "Мы не самые дешёвые на рынке. Но мы — те, к кому возвращаются за вторым, третьим и десятым проектом.",
  items: [
    {
      icon: Award,
      title: "5+ лет в Telegram",
      text: "С момента появления Bot API. Знаем все ограничения платформы и обходим их предсказуемо.",
    },
    {
      icon: CheckCircle2,
      title: "80+ ботов в продакшене",
      text: "Каждый — это конкретная бизнес-задача и измеримый результат. Кейсы покажем под NDA.",
    },
    {
      icon: Briefcase,
      title: "30+ клиентов",
      text: "От стартапов до Enterprise. Понимаем процессы любого масштаба.",
    },
    {
      icon: ShieldCheck,
      title: "Гарантия 30 дней",
      text: "Если найдём баг после сдачи — исправляем бесплатно. Качество — часть договора.",
    },
    {
      icon: Headphones,
      title: "Поддержка 24/7",
      text: "Дежурный инженер на связи. Критичные инциденты решаем в течение часа.",
    },
    {
      icon: FileText,
      title: "Прозрачные процессы",
      text: "Фиксированная цена в договоре, регулярные демо, доступ к репозиторию.",
    },
  ],
  cta: "Оставить заявку",
};
