"use client";

import Link from "next/link";
import { Logo } from "@/components/visuals/Logo";
import { MessageCircle, Send } from "lucide-react";

const services = [
  { label: "Боты поддержки", href: "#services" },
  { label: "Продающие боты", href: "#services" },
  { label: "AI-интеграции", href: "#services" },
  { label: "Мини-приложения", href: "#services" },
  { label: "Корпоративные боты", href: "#services" },
];

const company = [
  { label: "Процесс работы", href: "#process" },
  { label: "Тарифы", href: "#tariffs" },
  { label: "Вопросы", href: "#faq" },
  { label: "Связаться", href: "#lead-form" },
];

const docs = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Согласие на обработку ПДн", href: "/consent" },
  { label: "Договор-оферта", href: "#" },
];

export function Footer() {
  return (
    <footer
      className="border-t border-border"
      style={{ backgroundColor: "#0d1424", color: "#e6ebf2" }}
    >
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo textClassName="!text-white" />
            <p className="text-body-sm text-slate-400 leading-relaxed">
              Студия разработки ботов и AI-решений для MAX. От технического задания до запуска под
              ключ.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="Написать в MAX"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Написать в Telegram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Услуги
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-body-sm text-slate-200 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Компания
            </h3>
            <ul className="flex flex-col gap-3">
              {company.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-body-sm text-slate-200 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Документы
            </h3>
            <ul className="flex flex-col gap-3">
              {docs.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    prefetch
                    className="text-body-sm text-slate-200 hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-caption text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BotMax. Все права защищены.</p>
          <address className="not-italic text-center sm:text-right">
            ИП Иванов Иван Иванович, ИНН 123456789012, ОГРНИП 123456789012345
          </address>
        </div>
      </div>
    </footer>
  );
}
