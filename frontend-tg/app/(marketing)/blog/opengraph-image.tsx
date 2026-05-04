import { renderBlogOgImage, blogOgContentType, blogOgSize } from "shared/lib/blog-og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "Блог Legan Studio";
export const size = blogOgSize;
export const contentType = blogOgContentType;

export default function BlogOg() {
  return renderBlogOgImage({
    config: siteConfig,
    title: "Блог о разработке Telegram-ботов",
    description:
      "Mini Apps, оплата, рассылки, CRM-интеграции — разбираем по делу.",
    eyebrow: `Блог · ${siteConfig.siteName}`,
  });
}
