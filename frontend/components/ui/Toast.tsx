"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, { ring: string; icon: ReactNode }> = {
  success: {
    ring: "border-success/40",
    icon: <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />,
  },
  error: {
    ring: "border-error/40",
    icon: <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />,
  },
  info: {
    ring: "border-primary/40",
    icon: <Info className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
};

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pausedRef = useRef<Set<string>>(new Set());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    pausedRef.current.delete(id);
  }, []);

  const scheduleRemoval = useCallback(
    (id: string, duration: number) => {
      const timer = setTimeout(() => remove(id), duration);
      timersRef.current.set(id, timer);
    },
    [remove],
  );

  const show = useCallback<ToastContextValue["show"]>(
    (message, variant = "info", durationMs = DEFAULT_DURATION) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, message, variant, duration: durationMs };
      setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), toast]);
      scheduleRemoval(id, durationMs);
    },
    [scheduleRemoval],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    pausedRef.current.add(id);
  };

  const handleMouseLeave = (toast: Toast) => {
    if (pausedRef.current.has(toast.id)) {
      pausedRef.current.delete(toast.id);
      scheduleRemoval(toast.id, 2000);
    }
  };

  const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => handleMouseEnter(toast.id)}
              onMouseLeave={() => handleMouseLeave(toast)}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius)] border bg-bg-elevated px-4 py-3",
                "shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
                variantStyles[toast.variant].ring,
              )}
            >
              {variantStyles[toast.variant].icon}
              <p className="flex-1 text-body-sm text-fg">{toast.message}</p>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                aria-label="Закрыть уведомление"
                className="shrink-0 rounded-md p-0.5 text-fg-subtle hover:bg-bg-subtle hover:text-fg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
