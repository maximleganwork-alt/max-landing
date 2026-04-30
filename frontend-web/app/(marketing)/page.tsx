import { JsonLd, type JsonLdServiceEntry } from "shared/components/seo/JsonLd";
import { legalEntity } from "shared/lib/legal-entity";
import { siteConfig } from "@/lib/site";
import { siteContents } from "@/lib/content";
import { MarketingClient } from "./MarketingClient";

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
          legalName: legalEntity.legalName,
          siteUrl: siteConfig.siteUrl,
          description: siteConfig.metaDescription,
          contactEmail: legalEntity.contactEmail,
          sameAs: siteConfig.sameAs,
        }}
        services={services}
        faqItems={siteContents.faq.items}
        pageName={siteConfig.ogTitle}
        pageDescription={siteConfig.ogDescription}
      />
      <MarketingClient />
    </>
  );
}
