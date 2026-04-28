"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { smoothScrollTo } from "@/lib/utils";

const steps = [
  {
    title: "Бриф и анализ",
    duration: "1–2 дня",
    text: "Изучаем задачу, цели, целевую аудиторию. Бесплатно.",
  },
  {
    title: "ТЗ и оценка",
    duration: "1–3 дня",
    text: "Фиксируем требования, сценарии, сроки и стоимость. Подписываем договор.",
  },
  {
    title: "Дизайн и сценарии",
    duration: "2–5 дней",
    text: "Прорабатываем UX-сценарии диалога, экраны мини-приложения, тексты бота.",
  },
  {
    title: "Разработка",
    duration: "от 3 дней",
    text: "Пишем код, подключаем интеграции, обучаем AI-модели на вашей базе знаний.",
  },
  {
    title: "Тестирование",
    duration: "1–2 дня",
    text: "Проверяем сценарии, нагрузку, безопасность. Вы тестируете на своей стороне.",
  },
  {
    title: "Запуск",
    duration: "1 день",
    text: "Публикуем бота, настраиваем мониторинг и аналитику.",
  },
  {
    title: "Гарантия и поддержка",
    duration: "постоянно",
    text: "30 дней гарантии на исправление багов. Доработки — по отдельной договорённости.",
  },
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="section-padding bg-bg-subtle">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="process-heading"
            eyebrow="Как мы работаем"
            title="Как мы работаем"
            lead="Прозрачно, по этапам, с фиксированной ценой в договоре. Вы всегда знаете, на какой стадии проект."
          />
        </AnimateIn>

        <Stagger className="mt-12 hidden lg:block">
          <ol className="grid grid-cols-7 gap-4 relative">
            <span
              className="absolute top-5 left-[3rem] right-[3rem] h-px bg-border"
              aria-hidden="true"
            />
            {steps.map((step, i) => (
              <StaggerItem key={step.title} className="relative">
                <div className="flex flex-col items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white font-semibold text-body-sm relative z-10 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-fg leading-tight">{step.title}</h3>
                    <p className="mt-1 text-caption text-fg-subtle">{step.duration}</p>
                    <p className="mt-2 text-body-sm text-fg-muted leading-snug">{step.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>

        <Stagger className="mt-12 lg:hidden">
          <ol className="relative flex flex-col gap-6 pl-12">
            <span
              className="absolute left-5 top-2 bottom-2 w-px bg-border"
              aria-hidden="true"
            />
            {steps.map((step, i) => (
              <StaggerItem key={step.title} className="relative">
                <div className="absolute -left-12 top-0 grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white font-semibold text-body-sm">
                  {i + 1}
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-h3 font-semibold text-fg">{step.title}</h3>
                    <span className="text-caption text-fg-subtle">{step.duration}</span>
                  </div>
                  <p className="mt-2 text-body text-fg-muted leading-relaxed">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => smoothScrollTo("lead-form")}
          >
            Начать с брифа
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
