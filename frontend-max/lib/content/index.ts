import type { SiteContents } from "shared/components/MarketingHome";
import { headerContent } from "./header";
import { heroContent } from "./hero";
import { servicesContent } from "./services";
import { casesContent } from "./cases";
import { tariffsContent } from "./tariffs";
import { whyUsContent } from "./whyUs";
import { whyPlatformContent } from "./whyPlatform";
import { faqContent } from "./faq";
import { leadFormContent } from "./leadForm";
import { footerContent } from "./footer";

export const siteContents: SiteContents = {
  header: headerContent,
  hero: heroContent,
  services: servicesContent,
  cases: casesContent,
  whyUs: whyUsContent,
  tariffs: tariffsContent,
  whyPlatform: whyPlatformContent,
  faq: faqContent,
  leadForm: leadFormContent,
  footer: footerContent,
};
