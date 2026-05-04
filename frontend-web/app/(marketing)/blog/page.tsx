import type { Metadata } from "next";
import { Header } from "shared/components/layout/Header";
import { Footer } from "shared/components/sections/Footer";
import { JsonLd } from "shared/components/seo/JsonLd";
import { BlogIndex } from "shared/components/blog/BlogIndex";
import { legalEntity } from "shared/lib/legal-entity";
import { headerContent } from "@/lib/content/header";
import { footerContent } from "@/lib/content/footer";
import { siteConfig } from "@/lib/site";
import { getAllBlogSummaries } from "@/lib/blog";

const PAGE_TITLE = "Блог о веб-разработке, CRM и ERP";
const PAGE_DESCRIPTION =
  "Разбираем популярные вопросы по разработке сайтов, веб-приложений, CRM и ERP: стек, интеграции, безопасность, SEO и 152-ФЗ.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    type: "website",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/blog",
    images: ["/blog/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/blog/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogSummaries();
  const listItems = posts.slice(0, 30).map((p) => ({
    url: `/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    datePublished: p.date,
  }));

  return (
    <>
      <JsonLd
        variant="blog"
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
          { name: "Блог", url: `${siteConfig.siteUrl}/blog` },
        ]}
        pageName={PAGE_TITLE}
        pageDescription={PAGE_DESCRIPTION}
        blogListing={{ url: "/blog", items: listItems }}
      />
      <Header {...headerContent} />
      <main id="main" className="pt-[calc(var(--header-height)+32px)]">
        <BlogIndex
          posts={posts}
          title="Блог о веб-разработке, CRM и ERP"
          lead="Стек, интеграции, безопасность, SEO и 152-ФЗ — разбираем по делу и без воды."
        />
      </main>
      <Footer {...footerContent} />
    </>
  );
}
