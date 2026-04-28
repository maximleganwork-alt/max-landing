"use client";

import {
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { smoothScrollTo } from "@/lib/utils";

interface Reason {
  icon: LucideIcon;
  title: string;
  text: string;
}

const reasons: Reason[] = [
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
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="section-padding bg-bg-subtle"
    >
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="why-us-heading"
            title="Почему выбирают нас"
            lead="Мы не самые дешёвые на рынке. Но мы — те, к кому возвращаются за вторым, третьим и десятым проектом."
          />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reasons.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card card-hover h-full p-6">
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.6}
                  className="h-8 w-8 [stroke:url(#cardIconGrad)]"
                />
                <h3 className="mt-5 text-h3 font-semibold text-fg leading-tight">{title}</h3>
                <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => smoothScrollTo("lead-form")}>
            Оставить заявку
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
