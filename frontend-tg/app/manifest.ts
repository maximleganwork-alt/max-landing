import type { MetadataRoute } from "next";
import { buildSiteManifest } from "shared/lib/site-manifest";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return buildSiteManifest(siteConfig);
}
