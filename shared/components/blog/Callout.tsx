import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";

interface CalloutProps {
  type?: "info" | "tip" | "warning";
  title?: string;
  children: ReactNode;
}

/**
 * Боковая «выноска» в тексте. Тонкая стилизация, цвет берёт из темы.
 * Использовать осторожно — выноска ломает ритм статьи.
 */
export function Callout({ type = "info", title, children }: CalloutProps) {
  const Icon = type === "tip" ? Lightbulb : type === "warning" ? AlertTriangle : Info;
  const palette =
    type === "warning"
      ? { bg: "rgba(245, 158, 11, 0.08)", border: "var(--warning)", text: "var(--fg)" }
      : type === "tip"
      ? { bg: "rgba(16, 185, 129, 0.08)", border: "var(--success)", text: "var(--fg)" }
      : { bg: "var(--bg-subtle)", border: "var(--brand-grad-from)", text: "var(--fg)" };

  return (
    <aside
      className="my-6 flex gap-3 rounded-[var(--radius)] border-l-4 p-4"
      style={{ background: palette.bg, borderLeftColor: palette.border, color: palette.text }}
    >
      <Icon
        className="mt-0.5 h-5 w-5 shrink-0"
        aria-hidden="true"
        style={{ color: palette.border }}
      />
      <div className="text-body-sm leading-relaxed">
        {title ? <p className="font-semibold mb-1">{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}
