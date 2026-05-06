import { ImageResponse } from "next/og";

/**
 * Утилита для динамической генерации иконок (favicon, apple-touch-icon)
 * через next/og. Каждый фронтенд импортирует её из своих `app/icon.tsx` и
 * `app/apple-icon.tsx`, передавая брендовые цвета.
 *
 * Преимущество над статическим SVG: Next.js на edge генерирует валидный PNG
 * с прозрачностью и cache-busting hash. Это закрывает Lighthouse-checklist
 * (apple-touch-icon обязан быть PNG ≥120×120) и iOS Add-to-Home-Screen
 * (Safari игнорирует SVG-иконки).
 *
 * Дизайн: квадрат с радиусом, заполненный брендовым градиентом, со стилизованной
 * монограммой «LS» в центре. Цвета берутся из siteConfig.
 */
interface RenderIconArgs {
  size: number;
  /** Начальный цвет градиента — обычно `themeColor` из siteConfig. */
  gradFrom: string;
  /** Конечный цвет градиента — обычно акцент. */
  gradTo: string;
}

export function renderBrandIcon({ size, gradFrom, gradTo }: RenderIconArgs) {
  // Радиус скругления — 22% от стороны (соответствует iOS-маске).
  const radius = Math.round(size * 0.22);
  // Размер монограммы — 60% от стороны.
  const letter = Math.round(size * 0.6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
          borderRadius: `${radius}px`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          color: "#ffffff",
          fontSize: letter,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        LS
      </div>
    ),
    { width: size, height: size },
  );
}
