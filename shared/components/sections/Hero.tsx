"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { CountUp } from "../../components/ui/CountUp";
import { reachGoal } from "../../lib/analytics";
import { smoothScrollTo } from "../../lib/utils";
import type { HeroContent } from "../../lib/content/hero";

interface HeroProps extends HeroContent {
  visual?: ReactNode;
}

export function Hero({
  heading,
  description,
  primaryCta,
  secondaryCta,
  stats,
  visual,
}: HeroProps) {
  const reduced = useReducedMotion();

  const handlePrimary = () => {
    reachGoal("cta_click_hero_primary");
    smoothScrollTo("lead-form");
  };

  const handleSecondary = () => {
    reachGoal("cta_click_hero_secondary");
    smoothScrollTo("tariffs");
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-[calc(var(--header-height)+48px)] pb-12 md:pt-[calc(var(--header-height)+72px)] md:pb-[120px]"
    >
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[600px] opacity-50"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 20%, var(--accent-soft) 0%, transparent 70%)",
        }}
      />

      <div
        className={
          visual
            ? "container-narrow grid grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16"
            : "container-narrow"
        }
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } },
          }}
          className="flex flex-col gap-6"
        >
          {/* h1 + description are above-the-fold and the LCP element — keep
              them visible at first paint to avoid a 300–500ms LCP penalty.
              We still animate later children for the visual stagger. */}
          <h1
            id="hero-heading"
            className="text-display font-bold text-fg text-balance"
          >
            {heading.before}
            <span className="text-primary">{heading.brand}</span>
            {heading.after}
          </h1>

          <p className="max-w-xl text-body-lg text-fg-muted text-pretty">
            {description}
          </p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              onClick={handlePrimary}
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {primaryCta}
            </Button>
            <Button onClick={handleSecondary} size="lg" variant="outline">
              {secondaryCta}
            </Button>
          </motion.div>

          <motion.dl
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className="mt-4 grid grid-cols-2 gap-px rounded-[var(--radius)] border border-border bg-border overflow-hidden sm:grid-cols-4"
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-bg-card px-4 py-4 text-left">
                <dd className="text-h2 font-bold text-fg">
                  {s.animate && s.value !== undefined ? (
                    <CountUp value={s.value} suffix={s.suffix} />
                  ) : (
                    <span>{s.text}</span>
                  )}
                </dd>
                <dt className="mt-1 text-caption text-fg-muted">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {visual ? (
          <div className="relative hidden items-center justify-center lg:flex">
            {visual}
          </div>
        ) : null}
      </div>
    </section>
  );
}
