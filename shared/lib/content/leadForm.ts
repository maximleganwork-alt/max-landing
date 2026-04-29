import type { ComponentType, SVGProps } from "react";
import type { GoalName } from "../analytics";

/**
 * Принимаем как lucide-icons, так и кастомные SVG-компоненты —
 * например MaxIcon с встроенным брендовым стилем.
 */
type ContactIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface LeadFormContact {
  icon: ContactIcon;
  iconBgClass: string;
  title: string;
  subtitle: string;
  href: string;
  goal?: GoalName;
}

export interface LeadFormContent {
  title: string;
  lead: string;
  contactsTitle: string;
  contactsLead: string;
  contacts: LeadFormContact[];
}
