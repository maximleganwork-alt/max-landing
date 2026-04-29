import type { FaqEntry } from "../../lib/content/faq";

export interface JsonLdServiceEntry {
  name: string;
  description: string;
  price: string;
  serviceType: string;
}

export interface JsonLdSiteInfo {
  brand: string;
  siteUrl: string;
  description: string;
  contactEmail: string;
}

interface JsonLdProps {
  variant?: "home" | "legal";
  breadcrumbs?: { name: string; url: string }[];
  site: JsonLdSiteInfo;
  services?: JsonLdServiceEntry[];
  faqItems?: FaqEntry[];
}

export function JsonLd({ variant = "home", breadcrumbs, site, services, faqItems }: JsonLdProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    url: `${site.siteUrl}/`,
    logo: `${site.siteUrl}/logo.png`,
    description: site.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: site.contactEmail,
      contactType: "sales",
      availableLanguage: ["ru"],
    },
    areaServed: "RU",
  };

  const blocks: object[] = [organization];

  if (variant === "home") {
    if (services && services.length > 0) {
      for (const s of services) {
        blocks.push({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: s.serviceType,
          name: s.name,
          description: s.description,
          provider: { "@type": "Organization", name: site.brand },
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
        });
      }
    }
    if (faqItems && faqItems.length > 0) {
      blocks.push({
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
      });
    }
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
