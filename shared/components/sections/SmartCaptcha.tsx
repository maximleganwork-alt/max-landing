"use client";

import Script from "next/script";
import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from "react";

declare global {
  interface Window {
    smartCaptcha?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          invisible?: boolean;
          hideShield?: boolean;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
        },
      ) => number;
      execute: (widgetId: number) => void;
      reset: (widgetId: number) => void;
      destroy: (widgetId: number) => void;
      getResponse: (widgetId: number) => string | null;
    };
  }
}

export interface SmartCaptchaHandle {
  execute: () => Promise<string>;
  reset: () => void;
}

interface SmartCaptchaProps {
  onError?: () => void;
}

export const SmartCaptcha = forwardRef<SmartCaptchaHandle, SmartCaptchaProps>(
  function SmartCaptcha({ onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const tokenResolverRef = useRef<((token: string) => void) | null>(null);
    const tokenRejecterRef = useRef<((err: Error) => void) | null>(null);
    const sitekey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY ?? "";

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.smartCaptcha || widgetIdRef.current !== null) return;
      try {
        widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
          sitekey,
          invisible: true,
          hideShield: true,
          callback: (token: string) => {
            tokenResolverRef.current?.(token);
            tokenResolverRef.current = null;
            tokenRejecterRef.current = null;
          },
          "error-callback": () => {
            tokenRejecterRef.current?.(new Error("captcha_error"));
            tokenResolverRef.current = null;
            tokenRejecterRef.current = null;
            onError?.();
          },
        });
      } catch {
        onError?.();
      }
    }, [sitekey, onError]);

    useEffect(() => {
      if (typeof window !== "undefined" && window.smartCaptcha) {
        renderWidget();
      }
      return () => {
        if (widgetIdRef.current !== null && window.smartCaptcha) {
          try {
            window.smartCaptcha.destroy(widgetIdRef.current);
          } catch {
            // no-op
          }
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

    useImperativeHandle(
      ref,
      () => ({
        execute: () =>
          new Promise<string>((resolve, reject) => {
            if (!sitekey) {
              resolve("dev-no-captcha");
              return;
            }
            if (widgetIdRef.current === null || !window.smartCaptcha) {
              reject(new Error("captcha_not_ready"));
              return;
            }
            tokenResolverRef.current = resolve;
            tokenRejecterRef.current = reject;
            try {
              window.smartCaptcha.reset(widgetIdRef.current);
              window.smartCaptcha.execute(widgetIdRef.current);
            } catch (e) {
              reject(e instanceof Error ? e : new Error("captcha_execute_error"));
            }
          }),
        reset: () => {
          if (widgetIdRef.current !== null && window.smartCaptcha) {
            try {
              window.smartCaptcha.reset(widgetIdRef.current);
            } catch {
              // no-op
            }
          }
        },
      }),
      [sitekey],
    );

    if (!sitekey) {
      return null;
    }

    return (
      <>
        {/* Без `?render=onload` Yandex SmartCaptcha экспортирует
            `window.smartCaptcha` сразу при загрузке — `onLoad` next/script
            ловит готовый API. Раньше был `?render=onload&onload=...` с
            несуществующим callback'ом → варнинг в консоли. */}
        <Script
          src="https://smartcaptcha.yandexcloud.net/captcha.js"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
        <div ref={containerRef} aria-hidden="true" />
      </>
    );
  },
);
