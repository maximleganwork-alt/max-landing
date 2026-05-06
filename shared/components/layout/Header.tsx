"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { Logo } from "../visuals/Logo";
import { Button } from "../ui/Button";
import { reachGoal } from "../../lib/analytics";
import { cn, smoothScrollTo } from "../../lib/utils";
import type { HeaderContent } from "../../lib/content/header";

export function Header({ ariaLabel, navItems, ctaLabel }: HeaderContent) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Менеджмент состояния body-scroll и фокуса при открытии mobile-меню.
  // На iOS Safari `overflow: hidden` на body НЕ блокирует body-scroll —
  // поэтому используем position: fixed с сохранением scrollY (восстановим
  // на закрытии). На Android/desktop достаточно `overflow: hidden`.
  useEffect(() => {
    if (!menuOpen) return;
    const isIOS = /iP(hone|ad|od)/.test(navigator.platform || "") ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    const scrollY = window.scrollY;
    const body = document.body;
    if (isIOS) {
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    } else {
      body.style.overflow = "hidden";
    }
    return () => {
      if (isIOS) {
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        window.scrollTo(0, scrollY);
      } else {
        body.style.overflow = "";
      }
    };
  }, [menuOpen]);

  // ESC закрывает меню; focus-trap удерживает Tab внутри drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && drawer) {
        const focusables = drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Перевод фокуса на первый фокусируемый элемент drawer'а (доступность).
    requestAnimationFrame(() => {
      const first = drawer?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      first?.focus();
    });
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // После client-side навигации Next.js на `/#section` хеш в URL появляется,
  // но браузер не делает scroll-to-anchor автоматически — нужно дождаться
  // монтирования секции и сделать scroll вручную. RAF-петля с пределом ~1.5 с
  // ловит как быструю отрисовку, так и медленную (lazy-секция или большая
  // картинка над секцией ещё не загрузилась).
  const scrollToAnchorAfterNav = (anchor: string) => {
    let attempts = 0;
    const tick = () => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < 90) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    // Якорь `#section` — гладкий скролл, но только если уже на главной.
    // С глубоких страниц переходим на `/#section` через Next router.
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      if (pathname === "/") {
        smoothScrollTo(id);
      } else {
        router.push(`/${href}`);
        scrollToAnchorAfterNav(id);
      }
      return;
    }
    // Внутренний путь типа `/blog` — пусть отрабатывает <a href> естественно
    // (Next добавит client-side навигацию через Link, но здесь у нас обычный
    // <a>, и того достаточно — переход через router.push сохранит SPA-стиль).
    if (href.startsWith("/")) {
      e.preventDefault();
      router.push(href);
    }
  };

  const handleCta = () => {
    reachGoal("cta_click_header");
    setMenuOpen(false);
    if (pathname === "/") {
      smoothScrollTo("lead-form");
    } else {
      router.push("/#lead-form");
      scrollToAnchorAfterNav("lead-form");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg">
      <div className="container-narrow flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        {/* логотип */}
        <a
          href="/"
          onClick={(e) => {
            // On the home page we keep the smooth-scroll affordance; deep pages
            // fall through and navigate normally so crawlers see a real link.
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={cn(
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
          aria-label={ariaLabel}
        >
          <Logo />
        </a>

        {/* навигация по центру с скользящей pill-подсветкой */}
        <nav aria-label="Главное меню" className="hidden lg:block">
          <ul
            className="flex items-center gap-1"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  onMouseEnter={() => setHoveredNav(item.href)}
                  onFocus={() => setHoveredNav(item.href)}
                  onBlur={() => setHoveredNav(null)}
                  className={cn(
                    "relative inline-flex items-center px-4 py-2",
                    "text-body-sm font-medium",
                    "text-fg-muted transition-colors duration-200",
                    "hover:text-primary focus-visible:text-primary focus-visible:outline-none",
                  )}
                >
                  {hoveredNav === item.href ? (
                    <m.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* справа: CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCta}
            size="sm"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="hidden lg:inline-flex h-10 px-5"
          >
            {ctaLabel}
          </Button>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md",
              "border border-border bg-bg-card text-fg",
              "transition-colors hover:border-border-strong",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <m.div
            ref={drawerRef}
            id="mobile-menu-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-[var(--header-height)] z-30 bg-bg"
            role="dialog"
            aria-modal="true"
            aria-label="Меню навигации"
          >
            <nav
              aria-label="Мобильное меню"
              className="container-narrow flex h-full flex-col py-6"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.2 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className="block rounded-[var(--radius)] px-4 py-4 text-h3 font-semibold text-fg hover:bg-bg-subtle transition-colors"
                    >
                      {item.label}
                    </a>
                  </m.li>
                ))}
              </ul>
              <div className="mt-auto pt-6 safe-bottom">
                <Button onClick={handleCta} size="lg" fullWidth>
                  {ctaLabel}
                </Button>
              </div>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
