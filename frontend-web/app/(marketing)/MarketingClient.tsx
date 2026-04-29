"use client";

import { MarketingHome } from "shared/components/MarketingHome";
import { FloatingCardsMockup } from "shared/components/visuals/FloatingCardsMockup";
import { siteContents } from "@/lib/content";

export function MarketingClient() {
  return (
    <MarketingHome contents={siteContents} heroVisual={<FloatingCardsMockup />} />
  );
}
