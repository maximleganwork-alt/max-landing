export interface FooterLink {
  label: string;
  /** Если ссылка — указываем `href`. Если текстовый пункт без ссылки — `text: true`. */
  href?: string;
  text?: boolean;
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
