import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "shared/components/layout/Header";
import { Footer } from "shared/components/sections/Footer";
import { JsonLd } from "shared/components/seo/JsonLd";
import { CaseDetail } from "shared/components/cases/CaseDetail";
import { headerContent } from "@/lib/content/header";
import { footerContent } from "@/lib/content/footer";
import { casesContent } from "@/lib/content/cases";
import { siteConfig } from "@/lib/site";
import { legalEntity } from "shared/lib/legal-entity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return casesContent.items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = casesContent.items.find((c) => c.slug === slug);
  if (!item) return { title: "Кейс не найден" };
  const url = `/cases/${item.slug}`;
  return {
    title: `${item.task} — ${item.client}`,
    description: item.solution,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: item.task,
      description: item.solution,
      url,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const idx = casesContent.items.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const item = casesContent.items[idx];
  const prev = idx > 0 ? { slug: casesContent.items[idx - 1].slug, client: casesContent.items[idx - 1].client } : null;
  const next =
    idx < casesContent.items.length - 1
      ? { slug: casesContent.items[idx + 1].slug, client: casesContent.items[idx + 1].client }
      : null;

  return (
    <>
      <JsonLd
        variant="case"
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
          { name: "Кейсы", url: `${siteConfig.siteUrl}/#cases` },
          { name: item.client, url: `${siteConfig.siteUrl}/cases/${item.slug}` },
        ]}
        caseStudy={{
          url: `/cases/${item.slug}`,
          title: item.task,
          description: item.solution,
          client: item.client,
          industry: item.industry,
          tech: item.tech,
        }}
      />
      <Header {...headerContent} />
      <main id="main" className="pt-[calc(var(--header-height)+32px)]">
        <CaseDetail item={item} prev={prev} next={next} />
      </main>
      <Footer {...footerContent} />
    </>
  );
}
