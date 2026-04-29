import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "shared/components/layout/Header";
import { Footer } from "shared/components/sections/Footer";
import { JsonLd } from "shared/components/seo/JsonLd";
import { headerContent } from "@/lib/content/header";
import { footerContent } from "@/lib/content/footer";
import { siteConfig } from "@/lib/site";
import { Consent } from "shared/components/legal/Consent";
import { legalEntity } from "shared/lib/legal-entity";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие пользователя на обработку персональных данных в соответствии с 152-ФЗ.",
  alternates: { canonical: "/consent" },
};

export default function ConsentPage() {
  return (
    <>
      <JsonLd
        variant="legal"
        site={{
          brand: legalEntity.brand,
          siteUrl: SITE_URL,
          description: siteConfig.metaDescription,
          contactEmail: legalEntity.contactEmail,
        }}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Согласие на обработку ПДн", url: `${SITE_URL}/consent` },
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
          <Consent entity={legalEntity} site={siteConfig} />
        </article>
      </main>
      <Footer {...footerContent} />
    </>
  );
}
