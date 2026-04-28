import { z } from "zod";

export const PHONE_REGEX = /^[\+\d\s\-\(\)]{10,20}$/;
export const NICK_REGEX = /^@[\w\d_]{4,32}$/;

export const leadSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(100, "Максимум 100 символов"),
  contact: z
    .string()
    .min(1, "Укажите контакт")
    .refine(
      (v) => PHONE_REGEX.test(v) || NICK_REGEX.test(v),
      "Укажите телефон в международном формате или @ник",
    ),
  message: z.string().max(1000, "Максимум 1000 символов").optional().or(z.literal("")),
  tariff: z.enum(["starter", "business", "enterprise", ""]).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Требуется согласие" }),
  }),
  captchaToken: z.string().min(1, "Подтвердите, что вы не робот"),
  website: z.string().max(0).optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const TARIFF_LABELS: Record<NonNullable<LeadFormData["tariff"]>, string> = {
  starter: "Старт",
  business: "Бизнес",
  enterprise: "Корпоративный",
  "": "",
};
