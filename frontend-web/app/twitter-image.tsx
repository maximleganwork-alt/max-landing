import { ogImageContentType, ogImageSize, renderSiteOgImage } from "shared/lib/og-image";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.ogTitle;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function TwitterImage() {
  return renderSiteOgImage(siteConfig);
}
