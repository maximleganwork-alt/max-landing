"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "../ui/Button";
import { reachGoal } from "../../lib/analytics";
import { smoothScrollTo } from "../../lib/utils";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const formEl = document.getElementById("lead-form");

    const onScroll = () => {
      const past600 = window.scrollY > 600;
      let nearForm = false;
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        nearForm = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setVisible(past600 && !nearForm);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    reachGoal("cta_click_sticky_mobile");
    smoothScrollTo("lead-form");
  };

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur safe-bottom"
        >
          <div className="px-4 py-3">
            <Button onClick={handleClick} size="lg" fullWidth>
              Обсудить проект
            </Button>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
