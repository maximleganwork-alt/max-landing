import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "shared/components/layout/Header";
import { Footer } from "shared/components/sections/Footer";
import { JsonLd } from "shared/components/seo/JsonLd";
import { headerContent } from "@/lib/content/header";
import { footerContent } from "@/lib/content/footer";
import { siteConfig } from "@/lib/site";
import { Offer } from "shared/components/legal/Offer";
import { legalEntity } from "shared/lib/legal-entity";

export const metadata: Metadata = {
  title: "Договор-оферта",
  description:
    "Публичная оферта на оказание услуг по разработке ботов, сайтов и веб-приложений. Условия, сроки, стоимость, гарантия.",
  alternates: { canonical: "/offer" },
  openGraph: {
    type: "article",
    title: "Договор-оферта",
    description: "Публичная оферта на оказание услуг по разработке ПО.",
    url: "/offer",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function OfferPage() {
  return (
    <>
      <JsonLd
        variant="legal"
        legalDocumentType="TermsOfService"
        site={{
          brand: legalEntity.brand,
          legalName: legalEntity.legalName,
          siteUrl: siteConfig.siteUrl,
          description: siteConfig.metaDescription,
          contactEmail: legalEntity.contactEmail,
          sameAs: siteConfig.sameAs,
        }}
        breadcrumbs={[
          { name: "Главная", url: `${siteConfig.siteUrl}/` },
          { name: "Договор-оферта", url: `${siteConfig.siteUrl}/offer` },
        ]}
      />
      <Header {...headerContent} />
      <main id="main" className="pt-[calc(var(--header-height)+32px)]">
        <article className="container-narrow max-w-3xl pb-20">
          <Link
            href="/"
            prefetch
            className="inline-flex items-center gap-2 text-body-sm text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> На главную
          </Link>
          <Offer entity={legalEntity} site={siteConfig} />
        </article>
      </main>
      <Footer {...footerContent} />
    </>
  );
}
