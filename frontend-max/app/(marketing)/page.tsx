import { JsonLd, type JsonLdServiceEntry } from "shared/components/seo/JsonLd";
import { legalEntity } from "shared/lib/legal-entity";
import { siteConfig } from "@/lib/site";
import { siteContents } from "@/lib/content";
import { MarketingClient } from "./MarketingClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

const services: JsonLdServiceEntry[] = siteContents.tariffs.plans.map((p) => ({
  name: p.title,
  description: p.subtitle,
  price: (p.price.match(/\d+/g) ?? ["0"]).join(""),
  serviceType: siteConfig.serviceType,
}));

export default function HomePage() {
  return (
    <>
      <JsonLd
        variant="home"
        site={{
          brand: legalEntity.brand,
          siteUrl: SITE_URL,
          description: siteConfig.metaDescription,
          contactEmail: legalEntity.contactEmail,
        }}
        services={services}
        faqItems={siteContents.faq.items}
      />
      <MarketingClient />
    </>
  );
}
