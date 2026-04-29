"use client";

import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "../ui/AnimateIn";
import { smoothScrollTo } from "../../lib/utils";
import type { WhyPlatformContent } from "../../lib/content/whyPlatform";

export function WhyPlatform({ title, items, cta }: WhyPlatformContent) {
  return (
    <section
      id="why-platform"
      aria-labelledby="why-platform-heading"
      className="section-padding section-diagonal-bg"
    >
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="why-platform-heading" title={title} />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
          <Button
            variant="outline"
            size="lg"
            onClick={() => smoothScrollTo("lead-form")}
          >
            {cta}
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
