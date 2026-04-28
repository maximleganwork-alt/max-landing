"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { PhoneMockup } from "@/components/visuals/PhoneMockup";
import { reachGoal } from "@/lib/analytics";
import { smoothScrollTo } from "@/lib/utils";

const stats = [
  { value: 5, suffix: "+", label: "лет на рынке", animate: true },
  { value: 50, suffix: "+", label: "реализованных проектов", animate: true },
  { value: 20, suffix: "+", label: "корпоративных клиентов", animate: true },
  { label: "поддержка", text: "24/7", animate: false },
] as const;

export function Hero() {
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

      <div className="container-narrow grid grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } },
          }}
          className="flex flex-col gap-6"
        >
          <motion.h1
            id="hero-heading"
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="text-display font-bold text-fg text-balance"
          >
            Боты для <span className="text-primary">MAX</span>, которые работают на ваш бизнес
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className="max-w-xl text-body-lg text-fg-muted text-pretty"
          >
            Разрабатываем чат-ботов, AI-ассистентов и мини-приложения внутри национального
            мессенджера MAX. Под ключ — от технического задания до запуска и поддержки.
          </motion.p>

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
              Обсудить проект
            </Button>
            <Button onClick={handleSecondary} size="lg" variant="outline">
              Смотреть тарифы
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
                  {s.animate ? (
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

        <div className="relative hidden items-center justify-center lg:flex">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
