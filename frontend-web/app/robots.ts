import type { MetadataRoute } from "next";
import { buildSiteRobots } from "shared/lib/site-routing";

export default function robots(): MetadataRoute.Robots {
  return buildSiteRobots();
}
