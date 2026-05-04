import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { CaseVisual } from "../sections/cases/CaseVisual";
import type { CaseStudy } from "../../lib/content/cases";

interface CaseDetailProps {
  /** Кейс, который рендерим. */
  item: CaseStudy;
  /** Соседи в списке для нижней навигации. */
  prev?: { slug: string; client: string } | null;
  next?: { slug: string; client: string } | null;
}

export function CaseDetail({ item, prev, next }: CaseDetailProps) {
  return (
    <article className="container-narrow max-w-4xl pb-20">
      <Link
        href="/#cases"
        prefetch
        className="inline-flex items-center gap-2 text-body-sm text-fg-muted hover:text-fg transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Все кейсы
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-caption font-medium [color:var(--brand-grad-from)]">
            {item.industry}
          </span>
          <span className="text-caption text-fg-subtle">{item.client}</span>
        </div>
        <h1 className="mt-4 text-h1 font-bold text-fg leading-tight">{item.task}</h1>
        <p className="mt-4 text-body lg:text-body-lg text-fg-muted leading-relaxed">
          {item.solution}
        </p>
      </header>

      <div className="mt-10 overflow-hidden rounded-[var(--radius)] border border-border">
        <CaseVisual
          image={item.image}
          kind={item.visual}
          sizes="(min-width: 1200px) 1200px, calc(100vw - 48px)"
          className="rounded-none"
        />
      </div>

      {/* KPI row */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiTile value={item.metric.value} label={item.metric.label} primary />
        {item.details.results.slice(0, 3).map((r) => (
          <KpiTile key={r.label} value={r.value} label={r.label} />
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="text-h2 font-semibold text-fg">Задача</h2>
          <ul className="mt-4 space-y-3">
            {item.details.challenge.map((line) => (
              <li key={line} className="flex gap-3 text-body text-fg-muted leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--gradient-brand)" }}
                />
                {line}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-h2 font-semibold text-fg">Что сделали</h2>
          <ul className="mt-4 space-y-3">
            {item.details.deliverables.map((line) => (
              <li key={line} className="flex gap-3 text-body text-fg-muted leading-relaxed">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 [stroke:url(#caseDetailGrad)]" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <aside className="card h-fit p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
          <p className="text-caption font-semibold uppercase tracking-wide text-fg-subtle">
            Стек и интеграции
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-bg-subtle px-2 py-1 text-caption text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-caption text-fg-subtle">Срок</p>
            <p className="mt-1 text-body font-medium text-fg">{item.details.timeline}</p>
          </div>
          <Link
            href="/#lead-form"
            className="mt-6 block w-full rounded-[var(--radius)] px-4 py-3 text-center text-body font-medium text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            Обсудить проект
          </Link>
        </aside>
      </div>

      {/* SVG-defs for the check icon gradient. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="caseDetailGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-grad-from)" />
            <stop offset="100%" stopColor="var(--brand-grad-to)" />
          </linearGradient>
        </defs>
      </svg>

      {(prev || next) && (
        <nav className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/cases/${prev.slug}`}
              prefetch
              className="card card-hover flex items-center gap-3 p-5"
            >
              <ArrowLeft className="h-5 w-5 text-fg-muted" />
              <div>
                <p className="text-caption text-fg-subtle">Предыдущий кейс</p>
                <p className="mt-0.5 text-body font-medium text-fg">{prev.client}</p>
              </div>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/cases/${next.slug}`}
              prefetch
              className="card card-hover flex items-center justify-end gap-3 p-5 text-right"
            >
              <div>
                <p className="text-caption text-fg-subtle">Следующий кейс</p>
                <p className="mt-0.5 text-body font-medium text-fg">{next.client}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-fg-muted" />
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
    </article>
  );
}

function KpiTile({ value, label, primary = false }: { value: string; label: string; primary?: boolean }) {
  return (
    <div className="card p-5">
      <p
        className="text-h2 font-bold leading-none"
        style={
          primary
            ? {
                background: "var(--gradient-brand)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
            : { color: "var(--fg)" }
        }
      >
        {value}
      </p>
      <p className="mt-2 text-caption text-fg-subtle">{label}</p>
    </div>
  );
}
