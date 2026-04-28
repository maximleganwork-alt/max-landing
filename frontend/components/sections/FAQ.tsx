"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { smoothScrollTo } from "@/lib/utils";
import { faqItems } from "@/lib/faq";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="faq-heading"
            eyebrow="FAQ"
            title="Частые вопросы"
            align="center"
          />
        </AnimateIn>

        <AnimateIn delay={0.05} className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card px-2 sm:px-6">
            <Accordion>
              {faqItems.map((item) => (
                <AccordionItem key={item.q} question={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => smoothScrollTo("lead-form")}>
            Не нашли ответ? Напишите нам
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
