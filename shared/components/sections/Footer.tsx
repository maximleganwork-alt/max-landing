"use client";

import Link from "next/link";
import { Logo } from "../../components/visuals/Logo";
import { MessageCircle, Send } from "lucide-react";
import type { FooterContent } from "../../lib/content/footer";

export function Footer({
  description,
  servicesTitle,
  services,
  companyTitle,
  company,
  docsTitle,
  docs,
  social,
  copyright,
  legalAddress,
}: FooterContent) {
  return (
    <footer
      role="contentinfo"
      aria-label="Подвал сайта"
      className="border-t border-border"
      style={{ backgroundColor: "#0d1424", color: "#e6ebf2" }}
    >
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo className="!text-white" />
            <p className="text-body-sm text-slate-400 leading-relaxed">{description}</p>
            <ul className="flex items-center gap-2 list-none p-0 m-0">
              {social.map((s) => {
                const Icon = s.kind === "telegram" ? Send : MessageCircle;
                // Любой не-внутренний URL открываем в новой вкладке: https/http,
                // mailto/tel/sms — пользователь не должен терять страницу.
                const isExternal = /^(https?|mailto|tel|sms):/.test(s.href);
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      rel={isExternal ? "me noopener noreferrer" : undefined}
                      target={isExternal ? "_blank" : undefined}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-colors"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {servicesTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      className="text-body-sm text-slate-200 hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span className="text-body-sm text-slate-300">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {companyTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {company.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      className="text-body-sm text-slate-200 hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span className="text-body-sm text-slate-300">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {docsTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {docs.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <Link
                      href={s.href}
                      prefetch={false}
                      className="text-body-sm text-slate-200 hover:text-white transition-colors"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <span className="text-body-sm text-slate-300">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-caption text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <address className="not-italic text-center sm:text-right">{legalAddress}</address>
        </div>
      </div>
    </footer>
  );
}
