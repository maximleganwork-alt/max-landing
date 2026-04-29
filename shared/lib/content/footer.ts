export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocial {
  label: string;
  href: string;
  kind: "max" | "telegram";
}

export interface FooterContent {
  description: string;
  servicesTitle: string;
  services: FooterLink[];
  companyTitle: string;
  company: FooterLink[];
  docsTitle: string;
  docs: FooterLink[];
  social: FooterSocial[];
  copyright: string;
  legalAddress: string;
}
