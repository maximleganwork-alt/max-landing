import type { LucideIcon } from "lucide-react";

export interface WhyUsItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface WhyUsContent {
  title: string;
  lead: string;
  items: WhyUsItem[];
  cta: string;
}
