"use client";

import type { ReactElement } from "react";
import type { CaseVisualKind } from "../../../lib/content/cases";

/**
 * Шесть универсальных SVG-мокапов интерфейса для карточек кейсов.
 * Цвета берутся из CSS-переменных темы — на каждом лендинге визуал
 * автоматически перекрашивается под брендовый градиент.
 */

interface CaseVisualProps {
  kind: CaseVisualKind;
  /** Подпись над/в мокапе — позволяет тонко варьировать однотипные визуалы. */
  label?: string;
  className?: string;
}

export function CaseVisual({ kind, label, className }: CaseVisualProps) {
  const Component = visualMap[kind];
  return (
    <div
      aria-hidden="true"
      className={`relative w-full bg-bg-subtle ${className ?? ""}`}
    >
      <Component label={label} />
    </div>
  );
}

const visualMap: Record<CaseVisualKind, (props: { label?: string }) => ReactElement> = {
  chat: ChatVisual,
  miniapp: MiniAppVisual,
  kanban: KanbanVisual,
  dashboard: DashboardVisual,
  schedule: ScheduleVisual,
  payment: PaymentVisual,
};

/** Defs/градиенты используются всеми мокапами. Уникальный id на инстанс. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-brand`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--brand-grad-from)" />
        <stop offset="100%" stopColor="var(--brand-grad-to)" />
      </linearGradient>
      <filter id={`${id}-shadow`} x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.07" />
      </filter>
    </defs>
  );
}

function ChatVisual({ label }: { label?: string }) {
  const id = "chat";
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      {/* Шапка чата */}
      <rect x="20" y="18" width="320" height="36" rx="10" fill="var(--bg-card)" stroke="var(--border)" />
      <circle cx="40" cy="36" r="10" fill={`url(#${id}-brand)`} />
      <rect x="56" y="30" width="92" height="5" rx="2.5" fill="var(--fg)" />
      <rect x="56" y="40" width="46" height="4" rx="2" fill="var(--success)" opacity="0.7" />
      {label ? (
        <g transform="translate(228 26)">
          <rect width="98" height="20" rx="10" fill="var(--accent-soft)" />
          <text x="49" y="13" textAnchor="middle" fontSize="9" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{label}</text>
        </g>
      ) : null}

      {/* Сообщения */}
      <g transform="translate(20 70)">
        {/* Бот */}
        <rect width="180" height="28" rx="14" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="14" y="11" width="120" height="3.5" rx="1.75" fill="var(--fg)" opacity="0.55" />
        <rect x="14" y="18" width="80" height="3.5" rx="1.75" fill="var(--fg)" opacity="0.35" />

        {/* Юзер */}
        <g transform="translate(140 36)">
          <rect width="180" height="22" rx="11" fill={`url(#${id}-brand)`} />
          <rect x="14" y="9" width="120" height="3.5" rx="1.75" fill="white" opacity="0.85" />
        </g>

        {/* Бот: карточки-варианты */}
        <g transform="translate(0 66)">
          <rect width="220" height="60" rx="10" fill="var(--bg-card)" stroke="var(--border)" />
          <rect x="12" y="12" width="60" height="36" rx="6" fill="var(--accent-soft)" />
          <rect x="80" y="14" width="120" height="4" rx="2" fill="var(--fg)" opacity="0.55" />
          <rect x="80" y="22" width="100" height="3" rx="1.5" fill="var(--fg)" opacity="0.35" />
          <rect x="80" y="32" width="60" height="14" rx="7" fill={`url(#${id}-brand)`} />
        </g>
      </g>

      {/* Композер */}
      <g transform="translate(20 184)">
        <rect width="320" height="22" rx="11" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="14" y="9" width="100" height="4" rx="2" fill="var(--fg)" opacity="0.25" />
        <circle cx="304" cy="11" r="8" fill={`url(#${id}-brand)`} />
      </g>
    </svg>
  );
}

function MiniAppVisual({ label }: { label?: string }) {
  const id = "miniapp";
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      {/* Phone frame */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="100" y="14" width="160" height="200" rx="20" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
        {/* notch */}
        <rect x="160" y="20" width="40" height="5" rx="2.5" fill="var(--border-strong)" opacity="0.45" />
        {/* status row */}
        <rect x="116" y="36" width="60" height="6" rx="3" fill="var(--fg)" opacity="0.7" />
        <rect x="116" y="46" width="40" height="4" rx="2" fill="var(--success)" opacity="0.7" />
        {label ? (
          <g transform="translate(196 36)">
            <rect width="50" height="14" rx="7" fill="var(--accent-soft)" />
            <text x="25" y="9.5" textAnchor="middle" fontSize="7" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{label}</text>
          </g>
        ) : null}

        {/* Tile grid (catalog) */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${116 + (i % 2) * 66} ${64 + Math.floor(i / 2) * 50})`}>
            <rect width="56" height="42" rx="8" fill="var(--accent-soft)" />
            <rect x="8" y="26" width="32" height="3" rx="1.5" fill={`url(#${id}-brand)`} />
            <rect x="8" y="32" width="20" height="3" rx="1.5" fill="var(--fg)" opacity="0.4" />
          </g>
        ))}

        {/* CTA button */}
        <rect x="116" y="172" width="128" height="22" rx="11" fill={`url(#${id}-brand)`} />
        <rect x="166" y="201" width="28" height="3" rx="1.5" fill="var(--border-strong)" opacity="0.5" />
      </g>

      {/* Decorative chips */}
      <g transform="translate(28 50)">
        <rect width="62" height="18" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="10" y="7" width="42" height="4" rx="2" fill="var(--fg)" opacity="0.45" />
      </g>
      <g transform="translate(20 80)">
        <rect width="74" height="18" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="10" y="7" width="54" height="4" rx="2" fill="var(--fg)" opacity="0.45" />
      </g>
      <g transform="translate(34 110)">
        <rect width="54" height="18" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="10" y="7" width="34" height="4" rx="2" fill="var(--fg)" opacity="0.45" />
      </g>

      <g transform="translate(272 60)">
        <rect width="68" height="18" rx="9" fill={`url(#${id}-brand)`} opacity="0.18" />
        <rect x="10" y="7" width="48" height="4" rx="2" fill={`url(#${id}-brand)`} />
      </g>
      <g transform="translate(280 92)">
        <rect width="60" height="18" rx="9" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="10" y="7" width="40" height="4" rx="2" fill="var(--fg)" opacity="0.45" />
      </g>
    </svg>
  );
}

function KanbanVisual({ label }: { label?: string }) {
  const id = "kanban";
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      {/* Toolbar */}
      <rect x="20" y="18" width="320" height="22" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
      <rect x="32" y="26" width="86" height="6" rx="3" fill="var(--fg)" opacity="0.6" />
      {label ? (
        <g transform="translate(254 22)">
          <rect width="74" height="14" rx="7" fill={`url(#${id}-brand)`} opacity="0.18" />
          <text x="37" y="9.5" textAnchor="middle" fontSize="7" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{label}</text>
        </g>
      ) : null}

      {/* Three columns */}
      {[
        { x: 20, title: "Новые", count: 8, cards: 3 },
        { x: 134, title: "В работе", count: 5, cards: 2 },
        { x: 248, title: "Готово", count: 12, cards: 3 },
      ].map((col) => (
        <g key={col.x} transform={`translate(${col.x} 50)`}>
          <rect width="106" height="160" rx="10" fill="var(--bg-card)" stroke="var(--border)" />
          <rect x="12" y="12" width="56" height="5" rx="2.5" fill="var(--fg)" opacity="0.7" />
          <g transform="translate(78 10)">
            <rect width="18" height="12" rx="6" fill="var(--accent-soft)" />
            <text x="9" y="9" textAnchor="middle" fontSize="7" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{col.count}</text>
          </g>
          {/* cards */}
          {Array.from({ length: col.cards }).map((_, i) => (
            <g key={i} transform={`translate(8 ${28 + i * 38})`}>
              <rect width="90" height="32" rx="6" fill="var(--bg-subtle)" stroke="var(--border)" />
              <rect x="8" y="8" width="50" height="4" rx="2" fill="var(--fg)" opacity="0.6" />
              <rect x="8" y="16" width="36" height="3" rx="1.5" fill="var(--fg)" opacity="0.35" />
              <circle cx="80" cy="22" r="4" fill={`url(#${id}-brand)`} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function DashboardVisual({ label }: { label?: string }) {
  const id = "dashboard";
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      {/* Top metrics row */}
      {[
        { x: 20, big: "+27%", small: "Конверсия" },
        { x: 134, big: "12.4 K", small: "Заявок / мес" },
        { x: 248, big: "98%", small: "SLA" },
      ].map((m) => (
        <g key={m.x} transform={`translate(${m.x} 18)`}>
          <rect width="92" height="56" rx="10" fill="var(--bg-card)" stroke="var(--border)" />
          <text x="14" y="30" fontSize="14" fontFamily="Inter, system-ui" fontWeight="700" fill={`url(#${id}-brand)`}>
            {m.big}
          </text>
          <rect x="14" y="38" width="64" height="3" rx="1.5" fill="var(--fg)" opacity="0.4" />
          <rect x="14" y="44" width="40" height="3" rx="1.5" fill="var(--fg)" opacity="0.25" />
        </g>
      ))}

      {/* Chart */}
      <g transform="translate(20 88)">
        <rect width="320" height="116" rx="10" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="14" y="14" width="80" height="5" rx="2.5" fill="var(--fg)" opacity="0.6" />
        {label ? (
          <g transform="translate(252 10)">
            <rect width="56" height="14" rx="7" fill="var(--accent-soft)" />
            <text x="28" y="9.5" textAnchor="middle" fontSize="7" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{label}</text>
          </g>
        ) : null}
        {/* gridlines */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="20"
            x2="306"
            y1={36 + i * 18}
            y2={36 + i * 18}
            stroke="var(--border)"
            strokeDasharray="2 3"
          />
        ))}
        {/* curve */}
        <path
          d="M 20 86 L 60 72 L 100 80 L 140 56 L 180 62 L 220 40 L 260 50 L 300 28"
          fill="none"
          stroke={`url(#${id}-brand)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 20 86 L 60 72 L 100 80 L 140 56 L 180 62 L 220 40 L 260 50 L 300 28 L 300 100 L 20 100 Z"
          fill={`url(#${id}-brand)`}
          opacity="0.16"
        />
        {/* dots */}
        {[
          [20, 86],
          [60, 72],
          [100, 80],
          [140, 56],
          [180, 62],
          [220, 40],
          [260, 50],
          [300, 28],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="var(--bg-card)" stroke={`url(#${id}-brand)`} strokeWidth="1.5" />
        ))}
      </g>
    </svg>
  );
}

function ScheduleVisual({ label }: { label?: string }) {
  const id = "schedule";
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      <rect x="20" y="18" width="320" height="184" rx="12" fill="var(--bg-card)" stroke="var(--border)" />
      <rect x="36" y="32" width="100" height="6" rx="3" fill="var(--fg)" opacity="0.65" />
      {label ? (
        <g transform="translate(254 26)">
          <rect width="74" height="18" rx="9" fill={`url(#${id}-brand)`} opacity="0.18" />
          <text x="37" y="11.5" textAnchor="middle" fontSize="8" fontFamily="Inter, system-ui" fontWeight="600" fill={`url(#${id}-brand)`}>{label}</text>
        </g>
      ) : null}

      {/* Day headers */}
      {days.map((d, i) => (
        <text
          key={d}
          x={56 + i * 42}
          y="64"
          fontSize="9"
          fontFamily="Inter, system-ui"
          fontWeight="600"
          fill="var(--fg)"
          opacity="0.6"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}

      {/* Slot grid */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => {
          const filledCells = new Set([
            "0-1",
            "0-3",
            "1-0",
            "1-2",
            "1-5",
            "2-1",
            "2-4",
            "3-2",
            "3-6",
          ]);
          const key = `${row}-${col}`;
          const filled = filledCells.has(key);
          return (
            <g key={key} transform={`translate(${36 + col * 42} ${74 + row * 28})`}>
              <rect width="36" height="22" rx="6" fill={filled ? "var(--accent-soft)" : "var(--bg-subtle)"} stroke="var(--border)" />
              {filled ? (
                <>
                  <rect x="6" y="7" width="20" height="3" rx="1.5" fill={`url(#${id}-brand)`} />
                  <rect x="6" y="13" width="14" height="2.5" rx="1.25" fill="var(--fg)" opacity="0.4" />
                </>
              ) : null}
            </g>
          );
        }),
      )}

      {/* Bottom CTA */}
      <rect x="36" y="190" width="288" height="0" />
    </svg>
  );
}

function PaymentVisual({ label }: { label?: string }) {
  const id = "payment";
  return (
    <svg viewBox="0 0 360 220" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs id={id} />
      <rect width="360" height="220" fill="var(--bg-subtle)" />

      {/* Receipt-like card behind */}
      <g transform="translate(34 36)" filter={`url(#${id}-shadow)`}>
        <rect width="180" height="148" rx="12" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="14" y="18" width="84" height="6" rx="3" fill="var(--fg)" opacity="0.6" />
        <rect x="14" y="30" width="48" height="4" rx="2" fill="var(--fg)" opacity="0.3" />

        {/* Items */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(14 ${50 + i * 22})`}>
            <rect width="120" height="4" rx="2" fill="var(--fg)" opacity="0.45" />
            <rect x="138" width="14" height="4" rx="2" fill="var(--fg)" opacity="0.65" />
          </g>
        ))}

        <line x1="14" y1="120" x2="166" y2="120" stroke="var(--border)" />
        <rect x="14" y="128" width="40" height="6" rx="3" fill="var(--fg)" opacity="0.7" />
        <rect x="120" y="126" width="46" height="9" rx="4.5" fill={`url(#${id}-brand)`} />
      </g>

      {/* Pay button card */}
      <g transform="translate(192 56)" filter={`url(#${id}-shadow)`}>
        <rect width="138" height="108" rx="14" fill={`url(#${id}-brand)`} />
        {/* simulated card chip */}
        <rect x="16" y="20" width="22" height="16" rx="3" fill="white" opacity="0.45" />
        <rect x="16" y="48" width="106" height="3.5" rx="1.75" fill="white" opacity="0.7" />
        <rect x="16" y="58" width="68" height="3.5" rx="1.75" fill="white" opacity="0.55" />

        <rect x="16" y="78" width="106" height="18" rx="9" fill="white" />
        <text
          x="69"
          y="91"
          textAnchor="middle"
          fontSize="9"
          fontFamily="Inter, system-ui"
          fontWeight="700"
          fill="var(--fg)"
        >
          {label ?? "Оплатить"}
        </text>
      </g>
    </svg>
  );
}
