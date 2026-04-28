"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { smoothScrollTo } from "@/lib/utils";

const steps = [
  {
    title: "Бриф",
    duration: "1-2 дня",
    text: "Изучаем задачу, фиксируем требования и стоимость. Бриф — бесплатно.",
  },
  {
    title: "ТЗ и сценарии",
    duration: "2–5 дней",
    text: "UX-сценарии диалога, экраны мини-приложения, тексты бота.",
  },
  {
    title: "Разработка",
    duration: "от 3 дней",
    text: "Пишем код, подключаем интеграции, обучаем AI-модели.",
  },
  {
    title: "Тестирование",
    duration: "1–2 дня",
    text: "Проверяем сценарии, нагрузку и безопасность.",
  },
  {
    title: "Запуск",
    duration: "1 день",
    text: "Публикуем бота, настраиваем мониторинг и аналитику.",
  },
  {
    title: "Поддержка",
    duration: "постоянно",
    text: "30 дней гарантии. Доработки — по договорённости.",
  },
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="process-heading"
            title="Как мы работаем"
            lead="Прозрачно, по этапам, с фиксированной ценой в договоре. Вы всегда знаете, на какой стадии проект."
          />
        </AnimateIn>

        <Stagger className="mt-12 hidden lg:block">
          <ol className="grid grid-cols-6 gap-4 relative">
            {steps.map((step, i) => (
              <StaggerItem key={step.title} className="relative">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-5 left-[calc(50%+1.25rem)] right-[calc(0.25rem-50%)] h-px bg-border"
                  />
                ) : null}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white font-semibold text-body-sm relative z-10 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-fg leading-tight">{step.title}</h3>
                    <p className="mt-1 text-caption text-fg-subtle">{step.duration}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>

        <Stagger className="mt-8 lg:hidden">
          <ol className="relative flex flex-col gap-5">
            <span
              aria-hidden="true"
              className="absolute left-5 top-5 bottom-5 w-px bg-border"
            />
            {steps.map((step, i) => (
              <StaggerItem
                key={step.title}
                className="relative flex items-center gap-4"
              >
                <div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-white font-semibold text-body-sm">
                  {i + 1}
                </div>
                <div className="flex flex-1 items-baseline justify-between gap-3">
                  <h3 className="text-body font-semibold text-fg leading-tight">
                    {step.title}
                  </h3>
                  <span className="text-caption text-fg-subtle whitespace-nowrap">
                    {step.duration}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>

        <AnimateIn delay={0.1} className="mt-12 flex flex-col items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => smoothScrollTo("lead-form")}
          >
            Начать с брифа
          </Button>
          <p className="text-caption text-fg-subtle">
            Бриф и оценка проекта — <span className="font-semibold text-success">бесплатно</span>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
