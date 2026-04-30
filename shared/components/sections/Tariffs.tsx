"use client";

import { Check } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "../ui/AnimateIn";
import { reachGoal } from "../../lib/analytics";
import { cn, smoothScrollTo } from "../../lib/utils";
import type { TariffPlan, TariffsContent } from "../../lib/content/tariffs";

export function Tariffs({ title, lead, plans, footnote }: TariffsContent) {
  const handleSelect = (tariff: TariffPlan) => {
    reachGoal(tariff.goal);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tariff:select", { detail: { tariff: tariff.id } }),
      );
    }
    smoothScrollTo("lead-form");
  };

  return (
    <section id="tariffs" aria-labelledby="tariffs-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="tariffs-heading" title={title} lead={lead} />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((t) => (
            <StaggerItem
              key={t.id}
              className="h-full"
            >
              <div
                className={cn(
                  "relative h-full flex flex-col gap-6 rounded-[var(--radius-lg)] border bg-bg-card p-6 lg:p-8",
                  "transition-colors duration-200",
                  t.popular
                    ? "border-transparent shadow-[0_0_0_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
                    : "border-border hover:border-border-strong",
                )}
                style={
                  t.popular
                    ? {
                        backgroundImage:
                          "linear-gradient(var(--bg-card), var(--bg-card)), var(--gradient-brand)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }
                    : undefined
                }
              >
                {t.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-caption font-semibold uppercase tracking-wider text-white">
                    Популярный
                  </span>
                ) : null}

                <div>
                  <h3 className="text-h2 font-bold text-fg">{t.title}</h3>
                  <p className="mt-1 text-body-sm text-fg-muted">{t.subtitle}</p>
                </div>

                <div className="flex flex-col gap-1 border-y border-border py-5">
                  <span className="text-h1 font-bold text-fg whitespace-nowrap">{t.price}</span>
                  <span className="text-body-sm text-fg-muted">Срок: {t.duration}</span>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-body-sm text-fg">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success mt-0.5">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelect(t)}
                  variant={t.popular ? "primary" : "outline"}
                  size="lg"
                  fullWidth
                >
                  {t.cta}
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <AnimateIn delay={0.15} className="mt-10 text-center">
          <p className="text-body-sm text-fg-subtle max-w-2xl mx-auto">{footnote}</p>
        </AnimateIn>
      </div>
    </section>
  );
}
