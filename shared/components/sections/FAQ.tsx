"use client";

import { Button } from "../../components/ui/Button";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { AnimateIn } from "../../components/ui/AnimateIn";
import { Accordion, AccordionItem } from "../../components/ui/Accordion";
import { smoothScrollTo } from "../../lib/utils";
import type { FaqContent } from "../../lib/content/faq";

export function FAQ({ title, items, cta }: FaqContent) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="faq-heading" title={title} align="center" />
        </AnimateIn>

        <AnimateIn delay={0.05} className="mt-8 sm:mt-12 mx-auto max-w-3xl">
          <div className="sm:rounded-[var(--radius-lg)] sm:border sm:border-border sm:bg-bg-card sm:px-6">
            <Accordion>
              {items.map((item) => (
                <AccordionItem key={item.q} question={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => smoothScrollTo("lead-form")}>
            {cta}
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
