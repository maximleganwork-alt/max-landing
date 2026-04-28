"use client";

import { Users, Smartphone, Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { smoothScrollTo } from "@/lib/utils";

const cards = [
  {
    icon: Users,
    title: "100+ млн пользователей",
    text: "Активная аудитория растёт каждый день. По прогнозам VK — до 125 млн к 2027 году.",
  },
  {
    icon: Smartphone,
    title: "Предустановлен на смартфонах РФ",
    text: "С 1 сентября 2025 MAX обязателен к предустановке. Ваш бот доступен из коробки.",
  },
  {
    icon: Wallet,
    title: "Платежи внутри мессенджера",
    text: "Принимайте оплату, не выводя пользователя в браузер. СБП, карты, рассрочка — нативно.",
  },
  {
    icon: Shield,
    title: "Госуслуги и цифровой ID",
    text: "Подтверждение личности и электронная подпись прямо в боте — для финтеха, медицины, B2G.",
  },
];

export function WhyMax() {
  return (
    <section
      id="why-max"
      aria-labelledby="why-max-heading"
      className="section-padding bg-bg-subtle"
    >
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="why-max-heading"
            title="Почему MAX — это новая точка роста для бизнеса"
          />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card card-hover h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-accent-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-h3 font-semibold text-fg leading-tight">{title}</h3>
                <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => smoothScrollTo("lead-form")}
          >
            Узнать, как это работает у вас
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
