import type { LucideIcon } from "lucide-react";

export interface WhyPlatformItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface WhyPlatformContent {
  title: string;
  items: WhyPlatformItem[];
  cta: string;
}
