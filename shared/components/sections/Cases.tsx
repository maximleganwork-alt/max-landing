"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimateIn, Stagger, StaggerItem } from "../ui/AnimateIn";
import { cn, smoothScrollTo } from "../../lib/utils";
import type { CasesContent, CaseStudy } from "../../lib/content/cases";
import { CaseVisual } from "./cases/CaseVisual";

/**
 * Layout кейсов (на lg, 4-колоночная сетка):
 *
 *   ┌──────────────┬──────┐   row 1   item[0] = featured 2×2,
 *   │              │ [1]  │           visual сверху, текст снизу
 *   │  FEATURED    ├──────┤   row 2   item[1], [2] = col-span-2 row-span-1,
 *   │   (2×2)      │ [2]  │           horizontal (визуал слева)
 *   ├──────────────┴──────┤   row 3   item[3] = col-span-4 на всю ширину,
 *   │       [3] full      │           horizontal
 *   ├──────────┬──────────┤   row 4   item[4], [5] = col-span-2 каждая,
 *   │   [4]    │   [5]    │           horizontal
 *   └──────────┴──────────┘
 */
export function Cases({ title, lead, items, cta, ctaNote }: CasesContent) {
  return (
    <section id="cases" aria-labelledby="cases-heading" className="section-padding">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="cases-heading" title={title} lead={lead} />
        </AnimateIn>

        <Stagger className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr lg:gap-6">
          {items.map((item, i) => {
            const isFeatured = i === 0;
            const isFullRow = i === 3;
            return (
              <StaggerItem
                key={item.slug}
                className={cn(
                  isFeatured && "lg:col-span-2 lg:row-span-2",
                  isFullRow && "lg:col-span-4",
                  !isFeatured && !isFullRow && "lg:col-span-2",
                )}
              >
                <CaseCard
                  item={item}
                  variant={isFeatured ? "featured" : isFullRow ? "horizontal-wide" : "horizontal"}
                />
              </StaggerItem>
            );
          })}
        </Stagger>

        <AnimateIn delay={0.1} className="mt-10 flex flex-col items-center gap-3">
          <Button variant="outline" size="lg" onClick={() => smoothScrollTo("lead-form")}>
            {cta}
          </Button>
          {ctaNote ? <p className="text-caption text-fg-subtle">{ctaNote}</p> : null}
        </AnimateIn>
      </div>
    </section>
  );
}

interface CaseCardProps {
  item: CaseStudy;
  variant: "featured" | "horizontal" | "horizontal-wide";
}

function CaseCard({ item, variant }: CaseCardProps) {
  const isFeatured = variant === "featured";
  const isHorizontalWide = variant === "horizontal-wide";
  const isHorizontal = variant === "horizontal" || isHorizontalWide;
  const showSolution = isFeatured || isHorizontalWide;

  return (
    <Link
      href={`/cases/${item.slug}`}
      prefetch
      aria-label={`${item.client} — открыть кейс`}
      className={cn(
        "card card-hover group relative h-full overflow-hidden flex",
        isHorizontal ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 border-b border-border",
          isFeatured && "h-56 lg:h-72",
          isHorizontal && "h-44 lg:h-auto lg:w-2/5 lg:border-b-0 lg:border-r",
        )}
      >
        <CaseVisual kind={item.visual} className="absolute inset-0 h-full" />
      </div>

      <div
        className={cn(
          "relative flex flex-1 flex-col gap-3 p-6",
          isFeatured && "lg:p-8",
          isHorizontal && "lg:p-7",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-caption font-medium text-fg [color:var(--brand-grad-from)]">
            {item.industry}
          </span>
          <span className="text-caption text-fg-subtle">{item.client}</span>
        </div>

        <div>
          <h3
            className={cn(
              "font-semibold text-fg leading-tight",
              isFeatured ? "text-h2" : "text-h3",
            )}
          >
            {item.task}
          </h3>
          {showSolution && (
            <p className="mt-3 text-body-sm text-fg-muted leading-relaxed lg:text-body">
              {item.solution}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-2">
          <div>
            <div
              className={cn(
                "font-bold leading-none",
                isFeatured ? "text-h1" : "text-h2",
              )}
              style={{
                background: "var(--gradient-brand)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {item.metric.value}
            </div>
            <p className="mt-1 text-caption text-fg-subtle">{item.metric.label}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-body-sm font-medium text-fg-muted transition-colors group-hover:text-fg">
            Подробнее
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
          {item.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md bg-bg-subtle px-2 py-0.5 text-caption text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
