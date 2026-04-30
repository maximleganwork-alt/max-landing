import type { FaqEntry } from "../../lib/content/faq";

export interface JsonLdServiceEntry {
  name: string;
  description: string;
  /** Numeric price (rubles, integer string). */
  price: string;
  /** schema.org Service.serviceType. */
  serviceType: string;
}

export interface JsonLdSiteInfo {
  brand: string;
  /** Optional legal name, e.g. "ИП Иванов Иван Иванович". Falls back to brand. */
  legalName?: string;
  siteUrl: string;
  description: string;
  contactEmail: string;
  /** Optional list of public profile URLs for schema.org sameAs. */
  sameAs?: string[];
  /** Optional logo URL — defaults to /icon.svg under siteUrl. */
  logoUrl?: string;
  /**
   * ISO 3166-1 alpha-2 codes for areas served. Defaults to RU + key CIS markets
   * because the FAQ promises "работаем по всему СНГ".
   */
  areaServed?: string[];
}

interface JsonLdProps {
  variant?: "home" | "legal";
  breadcrumbs?: { name: string; url: string }[];
  site: JsonLdSiteInfo;
  /** Tariff plans surfaced as Service offers + an OfferCatalog. */
  services?: JsonLdServiceEntry[];
  faqItems?: FaqEntry[];
  /** Page-level metadata for the WebPage block. */
  pageName?: string;
  pageDescription?: string;
  /** Specialised legal-document marker for /privacy, /consent and /offer. */
  legalDocumentType?: "PrivacyPolicy" | "DigitalDocument" | "TermsOfService";
}

const SCHEMA = "https://schema.org";
const DEFAULT_AREA_SERVED = ["RU", "BY", "KZ", "KG", "AM"];

/**
 * Render structured data as a single @graph block. Search engines prefer this
 * over multiple sibling <script> tags — the entire object graph is parsed
 * atomically and Rich Results Test shows it as one record.
 *
 * Cross-references between nodes use schema.org @id, so e.g. every Service
 * tariff points to the single Organization node instead of repeating it.
 */
export function JsonLd({
  variant = "home",
  breadcrumbs,
  site,
  services,
  faqItems,
  pageName,
  pageDescription,
  legalDocumentType,
}: JsonLdProps) {
  const siteUrl = site.siteUrl.replace(/\/+$/, "");
  const homeUrl = `${siteUrl}/`;
  const logoUrl = site.logoUrl ?? `${siteUrl}/icon.svg`;
  const sameAs = site.sameAs?.filter((url) => /^https?:\/\//.test(url)) ?? [];
  const areaServed = site.areaServed ?? DEFAULT_AREA_SERVED;
  const legalName = site.legalName ?? site.brand;

  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${homeUrl}#webpage`;

  // Quote prices for one year — Google Merchant flags Offers without a date.
  const priceValidUntil = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const organization = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: site.brand,
    legalName,
    url: homeUrl,
    logo: { "@type": "ImageObject", url: logoUrl, width: 512, height: 512 },
    image: logoUrl,
    description: site.description,
    email: site.contactEmail,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: site.contactEmail,
        contactType: "sales",
        availableLanguage: ["ru"],
        areaServed,
      },
      {
        "@type": "ContactPoint",
        email: site.contactEmail,
        contactType: "customer support",
        availableLanguage: ["ru"],
        areaServed,
      },
    ],
    areaServed,
    knowsLanguage: ["ru-RU"],
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: homeUrl,
    name: site.brand,
    inLanguage: "ru-RU",
    description: site.description,
    publisher: { "@id": orgId },
  };

  const graph: object[] = [organization, website];

  if (variant === "home") {
    graph.push({
      "@type": "WebPage",
      "@id": webpageId,
      url: homeUrl,
      name: pageName ?? site.brand,
      description: pageDescription ?? site.description,
      inLanguage: "ru-RU",
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
      primaryImageOfPage: { "@type": "ImageObject", url: logoUrl },
    });

    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: homeUrl },
      ],
    });

    if (services && services.length > 0) {
      for (const s of services) {
        graph.push({
          "@type": "Service",
          serviceType: s.serviceType,
          name: s.name,
          description: s.description,
          provider: { "@id": orgId },
          areaServed,
          offers: {
            "@type": "Offer",
            price: s.price,
            priceCurrency: "RUB",
            availability: "https://schema.org/InStock",
            priceValidUntil,
            url: homeUrl,
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: s.price,
              priceCurrency: "RUB",
              valueAddedTaxIncluded: true,
            },
          },
        });
      }

      graph.push({
        "@type": "OfferCatalog",
        name: `${site.brand} — тарифы`,
        itemListElement: services.map((s, i) => ({
          "@type": "Offer",
          position: i + 1,
          name: s.name,
          description: s.description,
          price: s.price,
          priceCurrency: "RUB",
          priceValidUntil,
          availability: "https://schema.org/InStock",
          itemOffered: {
            "@type": "Service",
            name: s.name,
            serviceType: s.serviceType,
            provider: { "@id": orgId },
          },
        })),
      });
    }

    if (faqItems && faqItems.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      });
    }
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  if (variant === "legal" && legalDocumentType && breadcrumbs && breadcrumbs.length > 0) {
    const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
    graph.push({
      "@type": legalDocumentType,
      name: lastCrumb.name,
      url: lastCrumb.url,
      inLanguage: "ru-RU",
      publisher: { "@id": orgId },
      isPartOf: { "@id": websiteId },
    });
  }

  const document = {
    "@context": SCHEMA,
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape `<` so an embedded `</script>` cannot break out of the tag.
        __html: JSON.stringify(document).replace(/</g, "\\u003c"),
      }}
    />
  );
}
