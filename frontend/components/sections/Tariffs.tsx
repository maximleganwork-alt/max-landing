"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { reachGoal, type GoalName } from "@/lib/analytics";
import { cn, smoothScrollTo } from "@/lib/utils";

interface Tariff {
  id: "starter" | "business" | "enterprise";
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: string[];
  cta: string;
  popular?: boolean;
  goal: GoalName;
}

const tariffs: Tariff[] = [
  {
    id: "starter",
    title: "Старт",
    subtitle: "Простой бот с базовой логикой",
    price: "от 15 000 ₽",
    duration: "3–5 дней",
    features: [
      "Сценарий до 15 шагов диалога",
      "Меню, кнопки, FAQ-ответы",
      "Сбор заявок и контактов",
      "Уведомления администратору",
      "Запуск и базовая настройка",
      "Гарантия 30 дней",
    ],
    cta: "Выбрать Старт",
    goal: "tariff_select_starter",
  },
  {
    id: "business",
    title: "Бизнес",
    subtitle: "Бот или мини-приложение с AI",
    price: "от 40 000 ₽",
    duration: "7–15 дней",
    features: [
      "Всё из тарифа «Старт»",
      "Сложный сценарий, ветвления, состояния",
      "Интеграция с AI (GPT/GigaChat/YandexGPT)",
      "Подключение 1 внешней системы (CRM/API)",
      "Мини-приложение или расширенный бот",
      "Базовая аналитика и метрики",
      "Гарантия 30 дней",
    ],
    cta: "Выбрать Бизнес",
    popular: true,
    goal: "tariff_select_business",
  },
  {
    id: "enterprise",
    title: "Корпоративный",
    subtitle: "Сложные системы для крупных проектов",
    price: "от 100 000 ₽",
    duration: "от 20 дней",
    features: [
      "Всё из тарифа «Бизнес»",
      "Сложная бизнес-логика и мульти-сценарии",
      "Глубокие AI-интеграции: RAG, fine-tuning, голос, vision",
      "Множественные интеграции (CRM, ERP, базы данных)",
      "Высокие нагрузки, отказоустойчивость",
      "Расширенная аналитика и дашборды",
      "Приоритетная поддержка",
      "Гарантия 30 дней",
    ],
    cta: "Обсудить проект",
    goal: "tariff_select_enterprise",
  },
];

export function Tariffs() {
  const handleSelect = (tariff: Tariff) => {
    reachGoal(tariff.goal);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tariff:select", { detail: { tariff: tariff.id } }),
      );
    }
    smoothScrollTo("lead-form");
  };

  return (
    <section id="tariffs" aria-labelledby="tariffs-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="tariffs-heading"
            eyebrow="Тарифы"
            title="Тарифы"
            lead="Цена зависит от сложности логики, количества интеграций и объёма AI-функционала. Все цены — стартовые, итоговая стоимость фиксируется в договоре после составления ТЗ."
          />
        </AnimateIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tariffs.map((t) => (
            <StaggerItem
              key={t.id}
              className={cn("h-full", t.popular && "md:col-span-2 lg:col-span-1")}
            >
              <div
                className={cn(
                  "relative h-full flex flex-col gap-6 rounded-[var(--radius-lg)] border bg-bg-card p-6 lg:p-8",
                  "transition-colors duration-200",
                  t.popular
                    ? "border-transparent ring-2 ring-primary/30"
                    : "border-border hover:border-border-strong",
                )}
                style={
                  t.popular
                    ? {
                        backgroundImage:
                          "linear-gradient(var(--bg-card), var(--bg-card)), var(--gradient-brand)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }
                    : undefined
                }
              >
                {t.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-caption font-semibold uppercase tracking-wider text-white">
                    Популярный
                  </span>
                ) : null}

                <div>
                  <h3 className="text-h2 font-bold text-fg">{t.title}</h3>
                  <p className="mt-1 text-body-sm text-fg-muted">{t.subtitle}</p>
                </div>

                <div className="flex flex-col gap-1 border-y border-border py-5">
                  <span className="text-h1 font-bold text-fg">{t.price}</span>
                  <span className="text-body-sm text-fg-muted">Срок: {t.duration}</span>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-body-sm text-fg">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success mt-0.5">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelect(t)}
                  variant={t.popular ? "primary" : "outline"}
                  size="lg"
                  fullWidth
                >
                  {t.cta}
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <AnimateIn delay={0.15} className="mt-10 text-center">
          <p className="text-body-sm text-fg-subtle max-w-2xl mx-auto">
            Нужна поддержка после запуска? Подключаем по отдельной договорённости — фиксируем
            объём работ и стоимость заранее.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
