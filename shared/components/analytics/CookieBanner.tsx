"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "../ui/Button";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== "accepted" && stored !== "rejected") setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    window.dispatchEvent(new Event("cookie:accepted"));
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="region"
          aria-label="Согласие на использование cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg-elevated safe-bottom"
        >
          <div className="container-narrow flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-sm text-fg-muted leading-relaxed sm:max-w-2xl">
              Мы используем технические cookies для работы сайта и аналитические — для Яндекс.Метрики.
              Аналитические cookies загружаются только после вашего согласия.{" "}
              <Link
                href="/privacy"
                className="text-primary underline-offset-2 hover:underline"
              >
                Подробнее
              </Link>
            </p>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
              <Button
                onClick={handleReject}
                size="md"
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                Отклонить
              </Button>
              <Button onClick={handleAccept} size="md" className="flex-1 sm:flex-initial">
                Принять
              </Button>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
