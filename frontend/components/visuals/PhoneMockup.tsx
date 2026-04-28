"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BatteryFull,
  Bot,
  CheckCheck,
  Mic,
  Paperclip,
  Send,
  Signal,
  Smile,
  Wifi,
} from "lucide-react";

type Step =
  | { kind: "text"; from: "user" | "bot"; text: string; time?: string }
  | { kind: "typing" }
  | {
      kind: "payment";
      title: string;
      item: string;
      total: string;
      paid?: boolean;
      time?: string;
    };

const sequence: Step[] = [
  { kind: "text", from: "user", text: "Хочу 2 пиццы Маргарита 🍕", time: "14:21" },
  { kind: "typing" },
  {
    kind: "text",
    from: "bot",
    text: "Адрес тот же — ул. Ленина, 12?",
    time: "14:21",
  },
  { kind: "text", from: "user", text: "Да, всё верно", time: "14:22" },
  { kind: "typing" },
  {
    kind: "payment",
    title: "Заказ #2087",
    item: "Маргарита 30 см × 2",
    total: "990 ₽",
    paid: true,
    time: "14:22",
  },
  {
    kind: "text",
    from: "bot",
    text: "Курьер выезжает 🛵 Доставим за 35 минут",
    time: "14:23",
  },
];

const stepDelays = [500, 700, 900, 800, 700, 1000, 900];

export function PhoneMockup() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgress(sequence.length);
      return;
    }
    let cancelled = false;
    let total = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    stepDelays.forEach((delay, i) => {
      total += delay;
      timers.push(
        setTimeout(() => {
          if (!cancelled) setProgress(i + 1);
        }, total),
      );
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  const visible = sequence.slice(0, progress).filter((item, idx) => {
    if (item.kind !== "typing") return true;
    const next = sequence[idx + 1];
    const isNextRevealed = idx + 1 < progress;
    if (next && next.kind !== "typing" && isNextRevealed) return false;
    return true;
  });

  return (
    <div className="relative mx-auto w-full max-w-[340px] aspect-[9/19] cursor-default select-none">
      {/* фоновое свечение */}
      <div
        className="pointer-events-none absolute -inset-12 -z-20"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 35%, color-mix(in srgb, var(--primary) 22%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-8 -z-10"
        style={{
          background:
            "radial-gradient(50% 45% at 60% 35%, var(--accent-soft) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full will-change-transform [transform:translateZ(0)]"
      >
        {/* корпус */}
        <svg
          viewBox="0 0 340 720"
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="phoneFrame" x1="0" y1="0" x2="0" y2="720">
              <stop offset="0%" stopColor="var(--border-strong)" />
              <stop offset="100%" stopColor="var(--border)" />
            </linearGradient>
            <linearGradient id="screenGloss" x1="0" y1="0" x2="0" y2="120">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* боковые кнопки слева */}
          <rect x="0" y="118" width="3" height="36" rx="1.5" fill="var(--border-strong)" />
          <rect x="0" y="180" width="3" height="62" rx="1.5" fill="var(--border-strong)" />
          <rect x="0" y="252" width="3" height="62" rx="1.5" fill="var(--border-strong)" />
          {/* кнопка справа (power) */}
          <rect x="337" y="200" width="3" height="100" rx="1.5" fill="var(--border-strong)" />

          {/* внешняя рамка */}
          <rect
            x="2"
            y="2"
            width="336"
            height="716"
            rx="48"
            ry="48"
            fill="var(--bg-elevated)"
            stroke="url(#phoneFrame)"
            strokeWidth="2"
          />
          {/* экран */}
          <rect x="14" y="14" width="312" height="692" rx="38" ry="38" fill="var(--bg-card)" />
          {/* блик стекла */}
          <rect
            x="14"
            y="14"
            width="312"
            height="120"
            rx="38"
            ry="38"
            fill="url(#screenGloss)"
            opacity="0.5"
          />
          {/* dynamic island */}
          <rect x="125" y="22" width="90" height="26" rx="13" fill="#0a0a0a" />
          <circle cx="200" cy="35" r="3" fill="#1a1a1a" />
          <circle cx="200" cy="35" r="1.2" fill="#3b3b3b" />
          {/* speaker grill */}
          <rect x="155" y="22" width="30" height="2" rx="1" fill="#1a1a1a" opacity="0.5" />
          {/* home indicator */}
          <rect x="120" y="688" width="100" height="4" rx="2" fill="var(--fg-subtle)" opacity="0.5" />
        </svg>

        {/* контент */}
        <div className="absolute inset-[14px] flex flex-col overflow-hidden rounded-[38px]">
          {/* status bar */}
          <div className="flex items-center justify-between bg-bg-subtle px-7 pt-3 pb-1 text-[10px] font-semibold text-fg">
            <span className="tabular-nums">14:23</span>
            <div className="flex items-center gap-1">
              <Signal className="h-2.5 w-2.5" aria-hidden="true" strokeWidth={3} />
              <Wifi className="h-2.5 w-2.5" aria-hidden="true" strokeWidth={3} />
              <BatteryFull className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
            </div>
          </div>

          {/* шапка чата */}
          <div className="flex items-center gap-3 border-b border-border bg-bg-subtle px-4 pt-2 pb-3">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand">
                <Bot className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="absolute right-0 bottom-0 grid h-3 w-3 place-items-center rounded-full bg-bg-subtle">
                <span className="h-2 w-2 rounded-full bg-success" />
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-body-sm font-semibold text-fg leading-tight">
                Бот «Пицца у Лёхи»
              </span>
              <span className="text-caption text-success leading-tight">в сети · отвечает</span>
            </div>
          </div>

          {/* лента сообщений */}
          <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3">
            <AnimatePresence initial={false}>
              {visible.map((item, idx) => {
                if (item.kind === "typing") {
                  return (
                    <motion.div
                      key={`typing-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-bg-subtle px-3 py-2.5">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="block h-1.5 w-1.5 rounded-full bg-fg-subtle"
                            animate={
                              reduced
                                ? undefined
                                : { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }
                            }
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: d * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                if (item.kind === "payment") {
                  return (
                    <motion.div
                      key={`pay-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex justify-start"
                    >
                      <div className="w-[78%] overflow-hidden rounded-2xl rounded-bl-sm border border-border bg-bg-card">
                        <div className="flex items-center justify-between gap-2 border-b border-border bg-bg-subtle px-3 py-2">
                          <span className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
                            {item.title}
                          </span>
                          <span className="rounded-full bg-[#E91E92]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E91E92]">
                            СБП
                          </span>
                        </div>
                        <div className="px-3 py-2.5 flex flex-col gap-1">
                          <span className="text-body-sm text-fg">{item.item}</span>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-caption text-fg-subtle">К оплате</span>
                            <span className="text-body-sm font-bold text-fg">{item.total}</span>
                          </div>
                        </div>
                        {item.paid ? (
                          <div className="flex items-center justify-center gap-1.5 border-t border-border bg-success/10 px-3 py-2 text-caption font-semibold text-success">
                            <CheckCheck className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                            Оплачено
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                }

                const isUser = item.from === "user";
                return (
                  <motion.div
                    key={`msg-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-0.5 max-w-[78%]">
                      <div
                        className={`relative rounded-2xl px-3.5 py-2 text-body-sm leading-snug ${
                          isUser
                            ? "bg-bg-subtle text-fg rounded-br-sm"
                            : "bg-primary text-white rounded-bl-sm"
                        }`}
                      >
                        {item.text}
                      </div>
                      {item.time ? (
                        <div
                          className={`flex items-center gap-1 px-1 ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-[9px] text-fg-subtle">{item.time}</span>
                          {isUser ? (
                            <CheckCheck
                              className="h-2.5 w-2.5 text-primary"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 border-t border-border bg-bg-subtle px-3 py-2.5">
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-fg-subtle"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-bg-card px-3 py-1.5">
              <span className="flex-1 text-caption text-fg-subtle">Сообщение…</span>
              <Smile className="h-4 w-4 text-fg-subtle" aria-hidden="true" />
            </div>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-brand"
            >
              <Mic className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
