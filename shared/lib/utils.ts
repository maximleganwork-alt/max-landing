import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

/**
 * Маска допустимых символов в UTM-метках. Большинство трафик-систем
 * (Яндекс.Директ, Google Ads, Метрика) ставят `[A-Za-z0-9_\-.+]` плюс
 * иногда кириллицу. Всё остальное (`<`, `>`, `"`, `'`, скобки, фигурные
 * скобки и т. д.) — потенциальные XSS/Markdown-инъекции, режем сразу.
 */
const UTM_SAFE = /[^\p{L}\p{N}_\-.+/=:%]/gu;
const UTM_MAX_LEN = 200;

function sanitizeUtm(value: string): string {
  return value.slice(0, UTM_MAX_LEN).replace(UTM_SAFE, "");
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const value = params.get(key);
    if (!value) return;
    const safe = sanitizeUtm(value);
    if (safe) utm[key] = safe;
  });
  return utm;
}

export function smoothScrollTo(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
