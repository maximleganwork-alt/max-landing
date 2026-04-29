"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimateIn } from "../ui/AnimateIn";
import { useToast } from "../ui/Toast";
import { SmartCaptcha, type SmartCaptchaHandle } from "./SmartCaptcha";
import { leadSchema, type LeadFormData } from "../../lib/schema";
import { reachGoal } from "../../lib/analytics";
import { getUTMParams } from "../../lib/utils";
import type { LeadFormContent } from "../../lib/content/leadForm";

interface LeadFormProps extends LeadFormContent {
  tariffLabels?: Record<string, string>;
}

export function LeadForm({
  title,
  lead,
  contactsTitle,
  contactsLead,
  contacts,
  tariffLabels,
}: LeadFormProps) {
  const { show } = useToast();
  const captchaRef = useRef<SmartCaptchaHandle>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
      tariff: "",
      consent: false,
      captchaToken: "",
      website: "",
    },
  });

  const tariffValue = watch("tariff") ?? "";

  useEffect(() => {
    const utm = getUTMParams();
    Object.entries(utm).forEach(([k, v]) => {
      setValue(k as keyof LeadFormData, v as never);
    });
  }, [setValue]);

  useEffect(() => {
    const onTariff = (e: Event) => {
      const detail = (e as CustomEvent<{ tariff: NonNullable<LeadFormData["tariff"]> }>).detail;
      if (detail?.tariff) {
        setValue("tariff", detail.tariff, { shouldValidate: false });
      }
    };
    window.addEventListener("tariff:select", onTariff);
    return () => window.removeEventListener("tariff:select", onTariff);
  }, [setValue]);

  const onSubmit = async (data: LeadFormData) => {
    if (data.website && data.website.length > 0) {
      reset();
      show("Заявка принята. Свяжемся в течение часа в рабочее время.", "success");
      return;
    }

    reachGoal("form_submit_attempt");

    let captchaToken = "dev-no-captcha";
    try {
      const token = await captchaRef.current?.execute();
      if (token) captchaToken = token;
    } catch {
      reachGoal("form_submit_error", { reason: "captcha" });
      show("Не удалось пройти проверку капчи. Попробуйте ещё раз.", "error");
      return;
    }

    try {
      const tariffLabel =
        data.tariff && tariffLabels ? tariffLabels[data.tariff] ?? "" : "";

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken, tariff_label: tariffLabel }),
      });

      if (res.status === 429) {
        reachGoal("form_submit_error", { reason: "rate_limit" });
        show("Слишком много попыток. Попробуйте через минуту.", "error");
        return;
      }

      if (!res.ok) {
        reachGoal("form_submit_error", { reason: `http_${res.status}` });
        show(
          "Что-то пошло не так. Попробуйте ещё раз или напишите нам в Telegram.",
          "error",
        );
        return;
      }

      reachGoal("form_submit_success");
      show("Заявка принята. Свяжемся в течение часа в рабочее время.", "success");
      reset();
      captchaRef.current?.reset();
    } catch {
      reachGoal("form_submit_error", { reason: "network" });
      show(
        "Что-то пошло не так. Попробуйте ещё раз или напишите нам в Telegram.",
        "error",
      );
    }
  };

  return (
    <section id="lead-form" aria-labelledby="lead-form-heading" className="section-padding section-leadform-bg">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading titleId="lead-form-heading" title={title} lead={lead} />
        </AnimateIn>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
          <AnimateIn delay={0.05}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5 sm:rounded-[var(--radius-lg)] sm:border sm:border-border sm:bg-bg-card sm:p-6 lg:p-8"
            >
              <Input
                label="Имя"
                placeholder="Ваше имя"
                autoComplete="name"
                {...register("name")}
                error={errors.name?.message}
                disabled={isSubmitting}
              />

              <Input
                label="Контакт для связи"
                placeholder="+7 999 123-45-67 или @nickname"
                autoComplete="tel"
                {...register("contact")}
                error={errors.contact?.message}
                disabled={isSubmitting}
              />

              <Textarea
                label="Кратко о задаче"
                placeholder="Опишите, что нужно сделать — мы изучим и подготовим оценку"
                rows={3}
                {...register("message")}
                error={errors.message?.message}
                disabled={isSubmitting}
              />

              {tariffValue && tariffLabels?.[tariffValue] ? (
                <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-accent-soft px-4 py-3 text-body-sm text-fg">
                  Выбран тариф:{" "}
                  <strong className="font-semibold">
                    {tariffLabels[tariffValue]}
                  </strong>
                </div>
              ) : null}

              <input type="hidden" {...register("tariff")} />
              <input type="hidden" {...register("utm_source")} />
              <input type="hidden" {...register("utm_medium")} />
              <input type="hidden" {...register("utm_campaign")} />
              <input type="hidden" {...register("utm_content")} />
              <input type="hidden" {...register("utm_term")} />

              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                {...register("website")}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 0,
                  height: 0,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />

              <input type="hidden" {...register("captchaToken")} />

              <SmartCaptcha ref={captchaRef} />

              <Checkbox
                {...register("consent")}
                error={errors.consent?.message}
                disabled={isSubmitting}
                label={
                  <>
                    Я даю согласие на{" "}
                    <Link
                      href="/consent"
                      target="_blank"
                      rel="noopener"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      обработку персональных данных
                    </Link>{" "}
                    и ознакомлен(а) с{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Политикой конфиденциальности
                    </Link>
                    .
                  </>
                }
              />

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                rightIcon={!isSubmitting ? <ArrowRight className="h-4 w-4" /> : undefined}
                className="sm:w-auto sm:self-start"
                fullWidth
              >
                Отправить заявку
              </Button>
            </form>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="flex h-full flex-col gap-6 sm:rounded-[var(--radius-lg)] sm:border sm:border-border sm:bg-bg-card sm:p-6 lg:p-8">
              <div>
                <h3 className="text-h3 font-semibold text-fg">{contactsTitle}</h3>
                <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{contactsLead}</p>
              </div>

              <div className="flex flex-col gap-3">
                {contacts.map((c) => {
                  const Icon = c.icon;
                  const isExternal = c.href.startsWith("http");
                  return (
                    <a
                      key={c.title}
                      href={c.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={c.goal ? () => reachGoal(c.goal!) : undefined}
                      className="group flex items-center gap-3 rounded-[var(--radius)] border border-border bg-bg-card px-4 py-3 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${c.iconBgClass}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="flex flex-1 flex-col">
                        <span className="text-body font-semibold text-fg leading-tight">
                          {c.title}
                        </span>
                        <span className="text-caption text-fg-subtle leading-tight">
                          {c.subtitle}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-fg-subtle transition-colors group-hover:text-primary" />
                    </a>
                  );
                })}
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
