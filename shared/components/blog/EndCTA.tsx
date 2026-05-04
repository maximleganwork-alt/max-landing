import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface EndCTAProps {
  /** Лид: 1–2 предложения о пользе для клиента. */
  children: ReactNode;
  /** Заголовок блока. По умолчанию — «Заказать разработку». */
  title?: string;
  /** Текст кнопки. По умолчанию — «Заказать разработку». */
  action?: string;
  /** Куда вести. По умолчанию якорь к лид-форме главной. */
  href?: string;
}

/**
 * Финальный CTA-блок статьи: крупная карточка с фирменным градиентом и
 * кнопкой к лид-форме. Использовать ровно один раз — в самом конце поста.
 */
export function EndCTA({
  children,
  title = "Заказать разработку",
  action = "Заказать разработку",
  href = "/#lead-form",
}: EndCTAProps) {
  return (
    <aside
      className="not-prose mt-12 mb-4 overflow-hidden rounded-[var(--radius-lg)] p-6 sm:p-8 text-white"
      style={{ background: "var(--gradient-brand)" }}
    >
      <h3 className="text-h2 font-bold leading-tight text-white">{title}</h3>
      <div className="mt-3 text-body sm:text-body-lg leading-relaxed text-white/90 [&_p]:my-0 [&_p]:text-white/90">
        {children}
      </div>
      <Link
        href={href}
        prefetch
        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-white px-6 py-3 text-body font-semibold text-fg hover:bg-white/90 transition-colors"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
