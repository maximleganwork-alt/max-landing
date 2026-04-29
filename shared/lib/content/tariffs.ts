import type { GoalName } from "../analytics";

export type TariffId = "starter" | "business" | "enterprise";

export interface TariffPlan {
  id: TariffId;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: string[];
  cta: string;
  popular?: boolean;
  goal: GoalName;
}

export interface TariffsContent {
  title: string;
  lead: string;
  plans: TariffPlan[];
  footnote: string;
}
