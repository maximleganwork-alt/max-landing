import { notFound } from "next/navigation";
import { renderBlogOgImage, blogOgContentType, blogOgSize } from "shared/lib/blog-og";
import { siteConfig } from "@/lib/site";
import { findPostBySlug, getAllBlogSummaries } from "@/lib/blog";

// NOTE: nodejs runtime — нужно `fs` для чтения MDX. Edge не подходит.
export const runtime = "nodejs";
export const alt = "Статья блога";
export const size = blogOgSize;
export const contentType = blogOgContentType;

export function generateStaticParams() {
  return getAllBlogSummaries().map((p) => ({ slug: p.slug }));
}

interface OgProps {
  params: Promise<{ slug: string }>;
}

export default async function PostOg({ params }: OgProps) {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) notFound();
  return renderBlogOgImage({
    config: siteConfig,
    title: post.title,
    description: post.description,
    eyebrow: `Блог · ${siteConfig.siteName}`,
  });
}
