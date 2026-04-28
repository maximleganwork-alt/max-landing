"use client";

import {
  Building2,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  Plug,
  ShoppingBag,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "@/components/ui/AnimateIn";
import { smoothScrollTo } from "@/lib/utils";

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  text: string;
}

const services: ServiceCard[] = [
  {
    icon: MessageCircle,
    title: "Боты поддержки клиентов",
    text: "Автоматизируем ответы на 80% типовых обращений. Тикеты, FAQ, маршрутизация на оператора.",
  },
  {
    icon: ShoppingBag,
    title: "Продающие боты",
    text: "Каталог, оформление заказа, оплата по СБП, статус доставки — всё внутри MAX.",
  },
  {
    icon: Users,
    title: "HR-боты",
    text: "Рекрутинг, онбординг новых сотрудников, опросы, заявки на отпуск.",
  },
  {
    icon: Building2,
    title: "Корпоративные боты",
    text: "Внутренний документооборот, заявки, согласования, уведомления для сотрудников.",
  },
  {
    icon: Megaphone,
    title: "Маркетинговые боты",
    text: "Лидогенерация, квизы, рассылки сегментам, персонализированные офферы.",
  },
  {
    icon: LayoutGrid,
    title: "Мини-приложения внутри MAX",
    text: "Полноценные веб-приложения, запускаемые из чата без перехода в браузер.",
  },
  {
    icon: Sparkles,
    title: "AI и LLM-интеграции",
    text: "GPT, GigaChat, YandexGPT. Умные диалоги, RAG по базе знаний, голос, распознавание изображений.",
  },
  {
    icon: Plug,
    title: "Интеграции с CRM и ERP",
    text: "1С, Битрикс24, amoCRM, ваши API. Бот становится частью существующих процессов.",
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="services-heading"
            eyebrow="Что мы делаем"
            title="Что мы разрабатываем для MAX"
            lead="Любые типы ботов и мини-приложений — от простых FAQ-помощников до сложных систем с AI и интеграцией в вашу инфраструктуру."
          />
        </AnimateIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {services.map(({ icon: Icon, title, text }) => (
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
          <Button
            variant="outline"
            size="lg"
            onClick={() => smoothScrollTo("lead-form")}
          >
            Получить оценку
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
