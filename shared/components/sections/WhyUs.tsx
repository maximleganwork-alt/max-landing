"use client";

import { Button } from "../../components/ui/Button";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "../../components/ui/AnimateIn";
import { smoothScrollTo } from "../../lib/utils";
import type { WhyUsContent } from "../../lib/content/whyUs";

export function WhyUs({ title, lead, items, cta }: WhyUsContent) {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="section-padding section-diagonal-bg"
    >
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="why-us-heading" title={title} lead={lead} />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card card-hover h-full p-6">
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.6}
                  className="h-8 w-8 [stroke:url(#cardIconGrad)]"
                />
                <h3 className="mt-5 text-h3 font-semibold text-fg leading-tight">{title}</h3>
                <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <AnimateIn delay={0.1} className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => smoothScrollTo("lead-form")}>
            {cta}
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
