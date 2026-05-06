import type { FooterContent } from "shared/lib/content/footer";

export const footerContent: FooterContent = {
  description:
    "Студия разработки ботов и AI-решений для MAX. От технического задания до запуска под ключ.",
  servicesTitle: "Услуги",
  services: [
    { label: "Боты поддержки и AI", text: true },
    { label: "Продающие боты", text: true },
    { label: "Мини-приложения", text: true },
    { label: "Корпоративные боты", text: true },
    { label: "Все услуги →", href: "/#services" },
  ],
  companyTitle: "Компания",
  company: [
    { label: "Кейсы", href: "/#cases" },
    { label: "Блог", href: "/blog" },
    { label: "Тарифы", href: "/#tariffs" },
    { label: "Вопросы", href: "/#faq" },
    { label: "Связаться", href: "/#lead-form" },
  ],
  docsTitle: "Документы",
  docs: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Согласие на обработку ПДн", href: "/consent" },
    { label: "Договор-оферта", href: "/offer" },
  ],
  social: [
    {
      label: "Написать в MAX",
      href: "https://max.ru/u/f9LHodD0cOKjUd8UClXenOZwU5qXWJ9wt6FCPLR7Ha3GUJ4fhkE5RJJ-rLo",
      kind: "max",
    },
    { label: "Написать в Telegram", href: "https://t.me/legan_studio", kind: "telegram" },
  ],
  copyright: "© 2026 Legan Studio. Все права защищены.",
  legalAddress: "ИП Леган Максим Артёмович, ИНН 910231127118, ОГРНИП 326911200028942",
};
