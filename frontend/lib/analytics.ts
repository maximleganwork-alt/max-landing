export type GoalName =
  | "cta_click_hero_primary"
  | "cta_click_hero_secondary"
  | "cta_click_header"
  | "cta_click_sticky_mobile"
  | "tariff_select_starter"
  | "tariff_select_business"
  | "tariff_select_enterprise"
  | "direct_message_click_max"
  | "direct_message_click_telegram"
  | "form_submit_attempt"
  | "form_submit_success"
  | "form_submit_error"
  | "faq_open";

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  }
}

export function reachGoal(goal: GoalName, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const id = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
  if (!id || !window.ym) return;
  try {
    window.ym(id, "reachGoal", goal, params);
  } catch {
    // no-op
  }
}

export function isMetrikaInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ym === "function";
}
