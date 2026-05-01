import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  /** Высота знака в px (ширина пропорциональна). По умолчанию 32. */
  size?: number;
}

/**
 * Монограмма L+S: L идёт сверху вниз, поворачивает вправо на «хвостик»,
 * из конца хвостика непрерывно вытекает S — нижняя кривая, средняя,
 * верхняя кривая. Один путь, толстая обводка с круглыми торцами.
 */
export function Logo({ className, size = 32 }: LogoProps) {
  // viewBox 38×32, пропорции ~1.19:1
  const width = Math.round((size * 38) / 32);
  return (
    <span className={cn("inline-flex items-center text-fg", className)}>
      <svg
        width={width}
        height={size}
        viewBox="0 0 38 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Legan Studio"
        role="img"
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
    </span>
  );
}
