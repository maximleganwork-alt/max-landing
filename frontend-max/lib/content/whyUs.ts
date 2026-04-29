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
      title: "5+ лет в разработке",
      text: "Команда с реальным production-опытом: боты, веб-приложения, CRM. MAX — логичное продолжение.",
    },
    {
      icon: CheckCircle2,
      title: "50+ проектов",
      text: "Каждый проект — это конкретная бизнес-задача и измеримый результат в продакшене.",
    },
    {
      icon: Briefcase,
      title: "20+ клиентов",
      text: "Среди заказчиков — компании от стартапов до Enterprise. Понимаем процессы любого масштаба.",
    },
    {
      icon: ShieldCheck,
      title: "Гарантия 30 дней",
      text: "Если найдём баг — исправляем бесплатно. Качество — не маркетинг, а часть договора.",
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
