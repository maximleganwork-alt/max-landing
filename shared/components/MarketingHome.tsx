"use client";

import type { ReactNode } from "react";
import { Header } from "./layout/Header";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Process } from "./sections/Process";
import { Tariffs } from "./sections/Tariffs";
import { WhyUs } from "./sections/WhyUs";
import { WhyPlatform } from "./sections/WhyPlatform";
import { FAQ } from "./sections/FAQ";
import { LeadForm } from "./sections/LeadForm";
import { Footer } from "./sections/Footer";

import type { HeaderContent } from "../lib/content/header";
import type { HeroContent } from "../lib/content/hero";
import type { ServicesContent } from "../lib/content/services";
import type { ProcessContent } from "../lib/content/process";
import type { TariffsContent } from "../lib/content/tariffs";
import type { WhyUsContent } from "../lib/content/whyUs";
import type { WhyPlatformContent } from "../lib/content/whyPlatform";
import type { FaqContent } from "../lib/content/faq";
import type { LeadFormContent } from "../lib/content/leadForm";
import type { FooterContent } from "../lib/content/footer";

export interface SiteContents {
  header: HeaderContent;
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  whyUs: WhyUsContent;
  tariffs: TariffsContent;
  whyPlatform: WhyPlatformContent;
  faq: FaqContent;
  leadForm: LeadFormContent;
  footer: FooterContent;
}

interface MarketingHomeProps {
  contents: SiteContents;
  heroVisual?: ReactNode;
}

export function MarketingHome({ contents, heroVisual }: MarketingHomeProps) {
  const tariffLabels = Object.fromEntries(
    contents.tariffs.plans.map((p) => [p.id, p.title]),
  );

  return (
    <>
      <Header {...contents.header} />
      <main id="main">
        <Hero {...contents.hero} visual={heroVisual} />
        <Services {...contents.services} />
        <Process {...contents.process} />
        <WhyUs {...contents.whyUs} />
        <Tariffs {...contents.tariffs} />
        <WhyPlatform {...contents.whyPlatform} />
        <FAQ {...contents.faq} />
        <LeadForm {...contents.leadForm} tariffLabels={tariffLabels} />
      </main>
      <Footer {...contents.footer} />
    </>
  );
}
