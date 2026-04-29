"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, TrendingUp, Users } from "lucide-react";

const chartPoints = [40, 55, 48, 70, 62, 88, 95];
const chartW = 200;
const chartH = 56;
const chartMax = 100;
const chartPath = (() => {
  const step = chartW / (chartPoints.length - 1);
  return chartPoints
    .map((p, i) => {
      const x = i * step;
      const y = chartH - (p / chartMax) * chartH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
})();
const chartArea = `${chartPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

export function FloatingCardsMockup() {
  const reduced = useReducedMotion();
  const enter = (delay: number) =>
    reduced
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 12, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay, duration: 0.5, ease: "easeOut" as const },
        };

  return (
    <div className="relative aspect-[5/4] w-full max-w-[560px]">
      {/* мягкое свечение */}
      <div
        className="pointer-events-none absolute -inset-12 -z-20"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 50%, color-mix(in srgb, var(--primary) 22%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-8 -z-10"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 50%, var(--accent-soft) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 1. KPI: Конверсия (top-left) */}
      <motion.div
        {...enter(0.15)}
        className="absolute left-[2%] top-[3%] z-20 w-[38%] rounded-[var(--radius)] border border-border bg-bg-elevated p-3 shadow-[0_12px_32px_rgba(0,0,0,0.10)]"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="flex items-center gap-1.5 text-[10px] text-fg-subtle">
          <TrendingUp className="h-3 w-3 text-primary" aria-hidden="true" />
          <span>Конверсия</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[20px] font-bold leading-none text-fg">12.4%</span>
          <span className="text-[10px] font-semibold text-success">+2.1%</span>
        </div>
        <div className="mt-2 flex h-3 items-end gap-0.5">
          {[35, 50, 42, 58, 65, 72, 80].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-gradient-brand"
              style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }}
            />
          ))}
        </div>
      </motion.div>

      {/* 2. Notification: новый платёж (top-right) */}
      <motion.div
        {...enter(0.25)}
        className="absolute right-[2%] top-[6%] z-20 flex w-[44%] items-center gap-2.5 rounded-[var(--radius)] border border-border bg-bg-elevated p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.10)]"
        style={{ transform: "rotate(4deg)" }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-semibold text-fg leading-tight">
            Платёж получен
          </span>
          <span className="text-[9px] text-fg-subtle leading-tight">
            ИП «Альфа» · ₽ 4 850
          </span>
        </div>
        <span className="text-[8px] text-fg-subtle">2 мин</span>
      </motion.div>

      {/* 3. График выручки (центр, главная) */}
      <motion.div
        {...enter(0.35)}
        className="absolute left-1/2 top-[50%] z-30 w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] text-fg-subtle">Выручка · 30 дней</div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-[20px] font-bold leading-none text-fg whitespace-nowrap">
                ₽ 2.4M
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-success">
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> +18%
              </span>
            </div>
          </div>
        </div>
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="mt-2 h-14 w-full"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="floatChartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-grad-from)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--brand-grad-to)" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="floatChartLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brand-grad-from)" />
              <stop offset="100%" stopColor="var(--brand-grad-to)" />
            </linearGradient>
          </defs>
          <motion.path
            d={chartArea}
            fill="url(#floatChartArea)"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.path
            d={chartPath}
            fill="none"
            stroke="url(#floatChartLine)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      {/* 4. Лиды (bottom-left) */}
      <motion.div
        {...enter(0.45)}
        className="absolute bottom-[3%] left-[3%] z-20 flex w-[40%] items-center gap-2 rounded-[var(--radius)] border border-border bg-bg-elevated p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.10)]"
        style={{ transform: "rotate(-2deg)" }}
      >
        <div className="flex -space-x-1.5">
          {["#5b8dff", "#34d399", "#f59e0b"].map((c, i) => (
            <span
              key={i}
              className="grid h-6 w-6 place-items-center rounded-full border-2 border-bg-elevated text-[8px] font-semibold text-white"
              style={{ background: c }}
            >
              {["А", "М", "К"][i]}
            </span>
          ))}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-semibold text-fg leading-tight">
            Новые лиды
          </span>
          <span className="text-[9px] text-fg-subtle leading-tight">
            <span className="text-success font-semibold">+184</span> за неделю
          </span>
        </div>
        <Users className="h-3.5 w-3.5 text-fg-subtle" aria-hidden="true" />
      </motion.div>

    </div>
  );
}
