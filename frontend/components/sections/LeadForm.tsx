"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useToast } from "@/components/ui/Toast";
import { DirectMessageModal } from "./DirectMessageModal";
import { SmartCaptcha, type SmartCaptchaHandle } from "./SmartCaptcha";
import { leadSchema, TARIFF_LABELS, type LeadFormData } from "@/lib/schema";
import { reachGoal } from "@/lib/analytics";
import { getUTMParams } from "@/lib/utils";

const MAX_MESSAGE = 1000;

export function LeadForm() {
  const { show } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
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
      consent: undefined,
      captchaToken: "",
      website: "",
    },
  });

  const messageValue = watch("message") ?? "";
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
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken }),
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
    <section id="lead-form" aria-labelledby="lead-form-heading" className="section-padding bg-bg-subtle">
      <div className="container-narrow">
        <AnimateIn>
          <SectionHeading
            titleId="lead-form-heading"
            eyebrow="Связаться"
            title="Расскажите о задаче"
            lead="Заполните форму — обсудим проект, бесплатно подготовим оценку и ТЗ. Или напишите нам напрямую — выбирайте удобный способ."
          />
        </AnimateIn>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
          <AnimateIn delay={0.05}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 lg:p-8 flex flex-col gap-5"
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
                hint="Телефон в международном формате или ник в MAX/Telegram"
                disabled={isSubmitting}
              />

              <Textarea
                label="Кратко о задаче"
                placeholder="Опишите, что нужно сделать — мы изучим и подготовим оценку"
                rows={4}
                {...register("message")}
                error={errors.message?.message}
                counter={{ current: messageValue.length, max: MAX_MESSAGE }}
                disabled={isSubmitting}
              />

              {tariffValue ? (
                <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-accent-soft px-4 py-3 text-body-sm text-fg">
                  Выбран тариф:{" "}
                  <strong className="font-semibold">
                    {TARIFF_LABELS[tariffValue as keyof typeof TARIFF_LABELS]}
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

              <Checkbox
                {...register("consent")}
                label={
                  <>
                    Я согласен на обработку персональных данных в соответствии с{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Политикой конфиденциальности
                    </Link>{" "}
                    и{" "}
                    <Link
                      href="/consent"
                      target="_blank"
                      rel="noopener"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Согласием на обработку ПДн
                    </Link>
                  </>
                }
                error={errors.consent?.message}
                disabled={isSubmitting}
              />

              <SmartCaptcha ref={captchaRef} />

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
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 lg:p-8 h-full flex flex-col gap-6">
              <div>
                <h3 className="text-h3 font-semibold text-fg">Хотите написать самостоятельно?</h3>
                <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">
                  Свяжитесь в любом удобном мессенджере — отвечаем в рабочее время в течение 30
                  минут.
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setModalOpen(true)}
              >
                Написать в мессенджер
              </Button>

              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6 text-body-sm text-fg-muted">
                <a
                  href="mailto:hello@example.ru"
                  className="inline-flex items-center gap-2 hover:text-fg transition-colors"
                >
                  <Mail className="h-4 w-4 text-fg-subtle" aria-hidden="true" />
                  hello@example.ru
                </a>
                <p className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-fg-subtle" aria-hidden="true" />
                  пн–пт 10:00–19:00 МСК
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>

        <DirectMessageModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
}
