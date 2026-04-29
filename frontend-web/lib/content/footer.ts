import type { FooterContent } from "shared/lib/content/footer";

export const footerContent: FooterContent = {
  description:
    "Студия веб-разработки. Сайты, e-commerce, CRM, ERP и SaaS-сервисы под ключ.",
  servicesTitle: "Услуги",
  services: [
    { label: "Лендинги", href: "#services" },
    { label: "Корпоративные сайты", href: "#services" },
    { label: "Интернет-магазины", href: "#services" },
    { label: "CRM и ERP", href: "#services" },
    { label: "SaaS-сервисы", href: "#services" },
  ],
  companyTitle: "Компания",
  company: [
    { label: "Процесс работы", href: "#process" },
    { label: "Тарифы", href: "#tariffs" },
    { label: "Вопросы", href: "#faq" },
    { label: "Связаться", href: "#lead-form" },
  ],
  docsTitle: "Документы",
  docs: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Согласие на обработку ПДн", href: "/consent" },
    { label: "Договор-оферта", href: "#" },
  ],
  social: [
    { label: "Написать в Telegram", href: "#", kind: "telegram" },
    { label: "Написать в MAX", href: "#", kind: "max" },
  ],
  copyright: "© 2026 BotMax. Все права защищены.",
  legalAddress: "ИП Иванов Иван Иванович, ИНН 123456789012, ОГРНИП 123456789012345",
};
