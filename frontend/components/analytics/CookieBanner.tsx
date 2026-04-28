"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== "accepted") setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    window.dispatchEvent(new Event("cookie:accepted"));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="region"
          aria-label="Согласие на использование cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg-elevated/95 backdrop-blur safe-bottom"
        >
          <div className="container-narrow flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-sm text-fg-muted leading-relaxed sm:max-w-2xl">
              Мы используем cookies и Яндекс.Метрику для аналитики. Продолжая использовать сайт,
              вы соглашаетесь с этим.{" "}
              <Link
                href="/privacy"
                className="text-primary underline-offset-2 hover:underline"
              >
                Подробнее
              </Link>
            </p>
            <Button onClick={handleAccept} size="md" className="shrink-0 self-stretch sm:self-auto">
              Принять
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
