"use client";

import { MarketingHome } from "shared/components/MarketingHome";
import { PhoneMockup } from "shared/components/visuals/PhoneMockup";
import { siteContents } from "@/lib/content";

export function MarketingClient() {
  return <MarketingHome contents={siteContents} heroVisual={<PhoneMockup />} />;
}
