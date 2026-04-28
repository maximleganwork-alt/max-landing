import { faqItems } from "@/lib/faq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BotMax",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  description: "Студия разработки ботов и мини-приложений для мессенджера MAX",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@example.ru",
    contactType: "sales",
    availableLanguage: ["ru"],
  },
  areaServed: "RU",
};

const services = [
  {
    name: "Старт",
    description: "Простой бот с базовой логикой: меню, FAQ, сбор заявок",
    price: "15000",
  },
  {
    name: "Бизнес",
    description: "Бот или мини-приложение с AI-интеграцией и подключением CRM",
    price: "40000",
  },
  {
    name: "Корпоративный",
    description: "Сложные системы для крупных проектов: глубокие AI, множественные интеграции",
    price: "100000",
  },
].map((s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Разработка чат-бота для MAX",
  name: s.name,
  description: s.description,
  provider: { "@type": "Organization", name: "BotMax" },
  areaServed: "RU",
  offers: {
    "@type": "Offer",
    price: s.price,
    priceCurrency: "RUB",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: s.price,
      priceCurrency: "RUB",
    },
  },
}));

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

interface JsonLdProps {
  variant?: "home" | "legal";
  breadcrumbs?: { name: string; url: string }[];
}

export function JsonLd({ variant = "home", breadcrumbs }: JsonLdProps) {
  const blocks: object[] = [organization];

  if (variant === "home") {
    blocks.push(...services, faqPage);
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
