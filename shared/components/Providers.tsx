"use client";

import type { ReactNode } from "react";
import { LazyMotion, domMax } from "framer-motion";
import { ToastProvider } from "../components/ui/Toast";

// strict: throws if any code uses `motion.*` instead of `m.*`, preventing
// regressions where a contributor reintroduces full-feature motion
// components and undoes the bundle savings.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <ToastProvider>{children}</ToastProvider>
    </LazyMotion>
  );
}
