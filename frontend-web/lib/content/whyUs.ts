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
      title: "5+ лет в веб-разработке",
      text: "От посадочных страниц до сложных корпоративных систем. Видели разное, знаем, где грабли.",
    },
    {
      icon: CheckCircle2,
      title: "120+ проектов",
      text: "Каждый — это конкретная бизнес-задача и измеримый результат. Кейсы покажем под NDA.",
    },
    {
      icon: Briefcase,
      title: "30+ клиентов",
      text: "От стартапов до Enterprise. Понимаем процессы любого масштаба и работаем по 152-ФЗ.",
    },
    {
      icon: ShieldCheck,
      title: "Гарантия 30 дней",
      text: "Если найдём баг после сдачи — исправляем бесплатно. Качество — часть договора, не маркетинга.",
    },
    {
      icon: Headphones,
      title: "Поддержка 24/7",
      text: "Дежурный инженер на связи. Критичные инциденты решаем в течение часа.",
    },
    {
      icon: FileText,
      title: "Прозрачные процессы",
      text: "Фиксированная цена в договоре, регулярные демо, полный доступ к репозиторию.",
    },
  ],
  cta: "Оставить заявку",
};
