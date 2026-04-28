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
import { cn, smoothScrollTo } from "@/lib/utils";

function AIVisual() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex flex-1 items-center pointer-events-none"
    >
      <svg
        viewBox="10 36 300 124"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="aiCardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.07" />
          </filter>
          <linearGradient id="aiBrandGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b8dff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Watermark: мини-нейросеть позади центральной карточки */}
        {(() => {
          const layers = [
            { x: 14, ys: [40, 76, 112, 148] },
            { x: 160, ys: [58, 100, 142] },
            { x: 306, ys: [40, 76, 112, 148] },
          ];
          const lines: { fx: number; fy: number; tx: number; ty: number }[] = [];
          for (let i = 0; i < layers.length - 1; i++) {
            for (const fy of layers[i].ys) {
              for (const ty of layers[i + 1].ys) {
                lines.push({
                  fx: layers[i].x,
                  fy,
                  tx: layers[i + 1].x,
                  ty,
                });
              }
            }
          }
          return (
            <g opacity="0.55">
              {lines.map((l, idx) => (
                <line
                  key={idx}
                  x1={l.fx}
                  y1={l.fy}
                  x2={l.tx}
                  y2={l.ty}
                  stroke="var(--border-strong)"
                  strokeWidth="0.6"
                  opacity="0.5"
                />
              ))}
              {layers.map((layer, li) =>
                layer.ys.map((y, ni) => (
                  <circle
                    key={`${li}-${ni}`}
                    cx={layer.x}
                    cy={y}
                    r="3.5"
                    fill="var(--bg-card)"
                    stroke="var(--border-strong)"
                    strokeWidth="1.2"
                  />
                )),
              )}
            </g>
          );
        })()}

        {/* Центральная карточка: мультимодальный AI-хаб */}
        <g transform="translate(60 50)" filter="url(#aiCardShadow)">
          <rect
            width="200"
            height="104"
            rx="14"
            fill="var(--bg-card)"
            stroke="var(--border)"
          />

          {/* Заголовок: аватар AI + имя + статус */}
          <circle cx="22" cy="22" r="10" fill="url(#aiBrandGradient)" />
          <rect x="38" y="16" width="64" height="6" rx="3" fill="var(--fg)" />
          <rect
            x="38"
            y="26"
            width="40"
            height="4"
            rx="2"
            fill="var(--success)"
            opacity="0.7"
          />

          {/* Три модальности: диалог, голос, распознавание изображений */}
          <g transform="translate(14 48)">
            {/* Диалог: «печатает» */}
            <rect width="50" height="38" rx="10" fill="var(--accent-soft)" />
            <circle cx="14" cy="19" r="2.5" fill="url(#aiBrandGradient)" />
            <circle cx="25" cy="19" r="2.5" fill="url(#aiBrandGradient)" />
            <circle cx="36" cy="19" r="2.5" fill="url(#aiBrandGradient)" />

            {/* Голос: волна */}
            <g transform="translate(61 0)">
              <rect width="50" height="38" rx="10" fill="var(--accent-soft)" />
              <rect x="6" y="17" width="3" height="4" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="12" y="13" width="3" height="12" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="18" y="9" width="3" height="20" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="24" y="7" width="3" height="24" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="30" y="11" width="3" height="16" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="36" y="15" width="3" height="8" rx="1.5" fill="url(#aiBrandGradient)" />
              <rect x="42" y="17" width="3" height="4" rx="1.5" fill="url(#aiBrandGradient)" />
            </g>

            {/* Изображение с bounding-box */}
            <g transform="translate(122 0)">
              <rect width="50" height="38" rx="10" fill="var(--accent-soft)" />
              <rect x="9" y="9" width="32" height="20" rx="3" fill="var(--bg-card)" />
              <path
                d="M9 24 L17 16 L23 21 L31 13 L41 24 L41 26 Q41 29 38 29 L12 29 Q9 29 9 26 Z"
                fill="url(#aiBrandGradient)"
                opacity="0.35"
              />
              <circle cx="16" cy="16" r="2" fill="url(#aiBrandGradient)" />
              <rect
                x="9"
                y="9"
                width="32"
                height="20"
                rx="3"
                fill="none"
                stroke="url(#aiBrandGradient)"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

function MiniAppsVisual() {
  return (
    <>
      <div
        aria-hidden="true"
        className="hidden lg:block absolute top-8 left-8 w-[260px] pointer-events-none select-none"
      >
      <svg
        viewBox="0 0 400 70"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="miniCardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.07" />
          </filter>
          <linearGradient id="miniBrandGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b8dff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Плитка 1 — слева, наклон влево */}
        <g transform="translate(8 6) rotate(-5 60 30)" filter="url(#miniCardShadow)">
          <rect width="120" height="60" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
          <rect width="120" height="12" rx="9" fill="var(--bg-subtle)" />
          <rect y="6" width="120" height="6" fill="var(--bg-subtle)" />
          <line x1="0" y1="12" x2="120" y2="12" stroke="var(--border)" />
          <circle cx="9" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="15" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="21" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />

          {/* Сетка плиток (каталог) */}
          <rect x="10" y="20" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="36" y="20" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="62" y="20" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="88" y="20" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="10" y="38" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="36" y="38" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="62" y="38" width="22" height="14" rx="3" fill="var(--accent-soft)" />
          <rect x="88" y="38" width="22" height="14" rx="3" fill="var(--accent-soft)" />
        </g>

        {/* Плитка 2 — центр, профиль + CTA */}
        <g transform="translate(140 4) rotate(2 60 30)" filter="url(#miniCardShadow)">
          <rect width="120" height="62" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
          <rect width="120" height="12" rx="9" fill="var(--bg-subtle)" />
          <rect y="6" width="120" height="6" fill="var(--bg-subtle)" />
          <line x1="0" y1="12" x2="120" y2="12" stroke="var(--border)" />
          <circle cx="9" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="15" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="21" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />

          <circle cx="16" cy="28" r="7" fill="url(#miniBrandGradient)" />
          <rect x="28" y="24" width="48" height="4" rx="2" fill="var(--fg)" />
          <rect
            x="28"
            y="31"
            width="28"
            height="3"
            rx="1.5"
            fill="var(--success)"
            opacity="0.7"
          />

          <rect x="10" y="44" width="100" height="12" rx="6" fill="url(#miniBrandGradient)" />
        </g>

        {/* Плитка 3 — справа, наклон вправо: оплата */}
        <g transform="translate(272 6) rotate(6 60 30)" filter="url(#miniCardShadow)">
          <rect width="120" height="60" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
          <rect width="120" height="12" rx="9" fill="var(--bg-subtle)" />
          <rect y="6" width="120" height="6" fill="var(--bg-subtle)" />
          <line x1="0" y1="12" x2="120" y2="12" stroke="var(--border)" />
          <circle cx="9" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="15" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />
          <circle cx="21" cy="6" r="1.5" fill="var(--border-strong)" opacity="0.5" />

          {/* Поля + кнопка оплаты */}
          <rect x="10" y="20" width="100" height="8" rx="3" fill="var(--bg-subtle)" />
          <rect x="10" y="32" width="100" height="8" rx="3" fill="var(--bg-subtle)" />
          <rect x="10" y="44" width="100" height="12" rx="6" fill="url(#miniBrandGradient)" />
        </g>
      </svg>
      </div>

      {/* Связь: пунктирная дуга со стрелкой от плиток к телефону */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute top-12 left-[300px] right-[120px] pointer-events-none select-none"
      >
        <svg
          viewBox="0 0 80 14"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="connectorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5b8dff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            d="M2 9 Q 40 0 76 8"
            stroke="url(#connectorGrad)"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Телефон с интерфейсом мини-аппа справа */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute top-4 right-8 w-[84px] pointer-events-none select-none"
      >
        <svg
          viewBox="-5 -3 80 122"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="phoneShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.07" />
            </filter>
            <linearGradient id="phoneBrandGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5b8dff" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          <g transform="rotate(6 35 56)" filter="url(#phoneShadow)">
            {/* Корпус */}
            <rect
              x="3"
              y="3"
              width="64"
              height="106"
              rx="11"
              fill="var(--bg-card)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            {/* Экран */}
            <rect
              x="7"
              y="12"
              width="56"
              height="88"
              rx="5"
              fill="var(--bg-subtle)"
            />

            {/* Динамик / notch */}
            <rect
              x="27"
              y="6"
              width="16"
              height="3"
              rx="1.5"
              fill="var(--border-strong)"
              opacity="0.5"
            />

            {/* Шапка приложения: avatar + имя */}
            <circle cx="15" cy="22" r="4" fill="url(#phoneBrandGradient)" />
            <rect x="22" y="20" width="26" height="2.5" rx="1.25" fill="var(--fg)" opacity="0.7" />
            <rect
              x="22"
              y="25"
              width="14"
              height="2"
              rx="1"
              fill="var(--success)"
              opacity="0.6"
            />

            {/* Карточка контента */}
            <rect
              x="11"
              y="34"
              width="48"
              height="22"
              rx="4"
              fill="var(--bg-card)"
              stroke="var(--border)"
            />
            <rect x="15" y="40" width="20" height="2" rx="1" fill="var(--fg)" opacity="0.5" />
            <rect x="15" y="46" width="28" height="2" rx="1" fill="var(--fg)" opacity="0.35" />
            <rect x="15" y="50" width="16" height="2" rx="1" fill="var(--fg)" opacity="0.35" />

            {/* Сетка плиток */}
            <rect x="11" y="62" width="14" height="14" rx="3" fill="var(--accent-soft)" />
            <rect x="28" y="62" width="14" height="14" rx="3" fill="var(--accent-soft)" />
            <rect x="45" y="62" width="14" height="14" rx="3" fill="var(--accent-soft)" />

            {/* CTA-кнопка */}
            <rect
              x="11"
              y="82"
              width="48"
              height="10"
              rx="5"
              fill="url(#phoneBrandGradient)"
            />

            {/* Home indicator */}
            <rect
              x="27"
              y="103"
              width="16"
              height="2"
              rx="1"
              fill="var(--border-strong)"
              opacity="0.5"
            />
          </g>
        </svg>
      </div>
    </>
  );
}

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  text: string;
}

// Порядок важен: первая карточка = featured (2×2), шестая = wide (2×1) на lg
const services: ServiceCard[] = [
  {
    icon: Sparkles,
    title: "AI-интеграции",
    text: "GPT, Claude, GigaChat, YandexGPT и локальные Llama/Qwen. Умные диалоги, RAG по базе знаний, голос, распознавание изображений.",
  },
  {
    icon: MessageCircle,
    title: "Боты поддержки",
    text: "Закрываем 80% типовых обращений: FAQ, тикеты, маршрутизация на оператора.",
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
    icon: LayoutGrid,
    title: "Мини-приложения",
    text: "Полноценные веб-приложения, запускаемые прямо из чата.",
  },
  {
    icon: Megaphone,
    title: "Маркетинг и лиды",
    text: "Лидогенерация, квизы, рассылки сегментам, персонализированные офферы.",
  },
  {
    icon: Plug,
    title: "CRM и ERP",
    text: "1С, Битрикс24, amoCRM, ваши API. Бот становится частью существующих процессов.",
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="section-padding bg-bg-subtle">
      <div className="container-narrow">
        {/* Глобальные SVG-defs: градиент для иконок карточек */}
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          className="absolute pointer-events-none"
        >
          <defs>
            <linearGradient id="cardIconGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5b8dff" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        <AnimateIn>
          <SectionHeading
            titleId="services-heading"
            title="Что мы разрабатываем для MAX"
            lead="Любые типы ботов и мини-приложений — от простых FAQ-помощников до сложных систем с AI и интеграцией в вашу инфраструктуру."
          />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:auto-rows-fr">
          {services.map(({ icon: Icon, title, text }, i) => {
            const isFeatured = i === 0;
            const isWide = i === 5;
            return (
              <StaggerItem
                key={title}
                className={cn(
                  isFeatured && "lg:col-span-2 lg:row-span-2",
                  isWide && "lg:col-span-2",
                )}
              >
                <div
                  className={cn(
                    "card card-hover h-full p-6 relative overflow-hidden flex flex-col",
                    isFeatured && "lg:p-8",
                    isWide && "lg:p-8",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.6}
                    className={cn(
                      "h-8 w-8 relative z-10 [stroke:url(#cardIconGrad)]",
                      (isFeatured || isWide) && "lg:hidden",
                    )}
                  />

                  {isFeatured && <AIVisual />}
                  {isWide && <MiniAppsVisual />}

                  <div className="relative z-10 mt-auto">
                    <h3
                      className={cn(
                        "font-semibold text-fg leading-tight text-h3 mt-5",
                        isFeatured && "lg:text-h2",
                        isWide && "lg:text-h2",
                      )}
                    >
                      {title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 text-fg-muted leading-relaxed",
                        isFeatured ? "lg:text-body text-body-sm" : "text-body-sm",
                        isWide && "lg:text-body",
                      )}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
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
