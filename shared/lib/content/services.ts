import type { LucideIcon } from "lucide-react";

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ServicesContent {
  title: string;
  lead: string;
  items: ServiceItem[];
  cta: string;
}
