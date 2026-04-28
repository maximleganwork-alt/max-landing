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
    title: "5+ лет в разработке систем",
    text: "Команда с реальным production-опытом: боты, веб-приложения, CRM. MAX — логичное продолжение.",
  },
  {
    icon: CheckCircle2,
    title: "50+ проектов в продакшене",
    text: "Каждый проект — это конкретная бизнес-задача и измеримый результат.",
  },
  {
    icon: Briefcase,
    title: "20+ корпоративных клиентов",
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
            eyebrow="Почему мы"
            title="Почему выбирают нас"
            lead="Мы не самые дешёвые на рынке. Но мы — те, к кому возвращаются за вторым, третьим и десятым проектом."
          />
        </AnimateIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reasons.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card card-hover h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-accent-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-h3 font-semibold text-fg">{title}</h3>
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
