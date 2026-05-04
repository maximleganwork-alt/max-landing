import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "shared/components/layout/Header";
import { Footer } from "shared/components/sections/Footer";
import { JsonLd } from "shared/components/seo/JsonLd";
import { BlogPostView } from "shared/components/blog/BlogPost";
import { legalEntity } from "shared/lib/legal-entity";
import {
  estimateReadingTime,
  extractFaqEntries,
} from "shared/lib/blog-utils";
import { headerContent } from "@/lib/content/header";
import { footerContent } from "@/lib/content/footer";
import { siteConfig } from "@/lib/site";
import { findPostBySlug, findRelatedPosts, getAllBlogSummaries } from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogSummaries().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) return { title: "Статья не найдена" };
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      images: [`${url}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${url}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) notFound();

  const allSummaries = getAllBlogSummaries();
  const related = findRelatedPosts(allSummaries, post, 3);
  const reading = estimateReadingTime(post.body);
  const faqItems = extractFaqEntries(post.body);

  return (
    <>
      <JsonLd
        variant="blogPosting"
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
          { name: post.title, url: `${siteConfig.siteUrl}/blog/${post.slug}` },
        ]}
        blogPosting={{
          url: `/blog/${post.slug}`,
          title: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated,
          keywords: post.tags,
          imageUrl: `${siteConfig.siteUrl}/blog/${post.slug}/opengraph-image`,
          wordCount: reading.words,
          timeRequired: `PT${reading.minutes}M`,
          faqItems: faqItems.length > 0 ? faqItems : undefined,
        }}
      />
      <Header {...headerContent} />
      <main id="main" className="pt-[calc(var(--header-height)+32px)]">
        <BlogPostView post={post} related={related} siteUrl={siteConfig.siteUrl} />
      </main>
      <Footer {...footerContent} />
    </>
  );
}
