"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/visuals/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { reachGoal } from "@/lib/analytics";
import { cn, smoothScrollTo } from "@/lib/utils";

const navItems = [
  { href: "#services", label: "Услуги" },
  { href: "#process", label: "Процесс" },
  { href: "#tariffs", label: "Тарифы" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY.current + 6) {
        setHidden(true);
      } else if (y < lastY.current - 6) {
        setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    smoothScrollTo(href.replace("#", ""));
  };

  const handleCta = () => {
    reachGoal("cta_click_header");
    setMenuOpen(false);
    smoothScrollTo("lead-form");
  };

  return (
    <motion.header
      animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg"
    >
      <div className="container-narrow flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        {/* логотип */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={cn(
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
          aria-label="BotMax — на главную"
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
                    <motion.span
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

        {/* справа: тема + CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex h-9 w-9" />

          <Button
            onClick={handleCta}
            size="sm"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="hidden lg:inline-flex h-10 px-5"
          >
            Обсудить проект
          </Button>

          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-[var(--header-height)] z-30 bg-bg"
            role="dialog"
            aria-modal="true"
          >
            <nav aria-label="Мобильное меню" className="container-narrow py-6">
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.li
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
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={handleCta} size="lg" fullWidth>
                  Обсудить проект
                </Button>
                <div className="flex items-center justify-between rounded-[var(--radius)] border border-border bg-bg-card px-4 py-3">
                  <span className="text-body-sm text-fg-muted">Тема</span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
