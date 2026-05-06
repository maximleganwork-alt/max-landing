"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Header } from "./layout/Header";
import { StickyCTA } from "./layout/StickyCTA";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Cases } from "./sections/Cases";
import { Tariffs } from "./sections/Tariffs";
import { WhyUs } from "./sections/WhyUs";
import { WhyPlatform } from "./sections/WhyPlatform";
import { FAQ } from "./sections/FAQ";
import { Footer } from "./sections/Footer";

// LeadForm is the LAST section on the page (8 screens down) and pulls in
// react-hook-form + zod-resolver + SmartCaptcha — heavy stuff for a marketing
// landing. Splitting it out drops First Load JS by ~20-25 KB gz; the chunk
// loads in the background as soon as the page hydrates, so by the time the
// user scrolls or clicks a "Обсудить проект" CTA the form is ready.
//
// `ssr: false` because the form has no SEO-relevant content (contacts also
// live in the Footer, which renders synchronously). The placeholder keeps the
// `#lead-form` anchor valid so smooth-scroll lands on the right offset before
// hydration completes.
const LeadForm = dynamic(
  () => import("./sections/LeadForm").then((m) => ({ default: m.LeadForm })),
  {
    ssr: false,
    loading: () => (
      <section
        id="lead-form"
        aria-hidden="true"
        className="section-padding section-leadform-bg min-h-[640px]"
      />
    ),
  },
);

import type { HeaderContent } from "../lib/content/header";
import type { HeroContent } from "../lib/content/hero";
import type { ServicesContent } from "../lib/content/services";
import type { CasesContent } from "../lib/content/cases";
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
  cases: CasesContent;
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
        <Cases {...contents.cases} />
        <WhyUs {...contents.whyUs} />
        <Tariffs {...contents.tariffs} />
        <WhyPlatform {...contents.whyPlatform} />
        <FAQ {...contents.faq} />
        <LeadForm {...contents.leadForm} tariffLabels={tariffLabels} />
      </main>
      <Footer {...contents.footer} />
      <StickyCTA />
    </>
  );
}
