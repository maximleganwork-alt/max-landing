import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  /** Высота знака в px (ширина пропорциональна). По умолчанию 28. */
  size?: number;
  /** Скрыть текст «Legan Studio» (оставить только знак). */
  iconOnly?: boolean;
  textClassName?: string;
}

/**
 * Монограмма L+S одной непрерывной обводкой + wordmark «Legan Studio» в Inter.
 * Inter уже подключён глобально, отдельный шрифт ради двух мест (хедер + футер)
 * не нужен — экономим ~30-50KB на каждом landing.
 * Знак — кастомный SVG-путь (L → хвост L → нижняя кривая S → верхняя кривая S).
 */
export function Logo({
  className,
  size = 28,
  iconOnly = false,
  textClassName,
}: LogoProps) {
  // viewBox поджат под фактические границы пути (с учётом stroke-width=5)
  const width = Math.round((size * 26) / 28);
  return (
    <span className={cn("inline-flex items-center gap-3 text-fg", className)}>
      <svg
        width={width}
        height={size}
        viewBox="2 2 26 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={iconOnly ? undefined : "true"}
        aria-label={iconOnly ? "Legan Studio" : undefined}
        role={iconOnly ? "img" : undefined}
        className="shrink-0"
      >
        <path
          d="M 7 5 V 22 A 4 4 0 0 0 11 26 H 17 C 26 26 28 18 19 18 C 10 18 12 9 21 9"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {iconOnly ? null : (
        <span
          className={cn(
            "font-extrabold text-body-lg leading-none tracking-tight",
            textClassName,
          )}
        >
          Legan Studio
        </span>
      )}
    </span>
  );
}
