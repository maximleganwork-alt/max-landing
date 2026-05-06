"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

export function YandexMetrika() {
  const [consented, setConsented] = useState(false);
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "accepted") setConsented(true);

    const onConsent = () => setConsented(true);
    window.addEventListener("cookie:accepted", onConsent);
    return () => window.removeEventListener("cookie:accepted", onConsent);
  }, []);

  if (!id || !consented) return null;

  const counterId = Number(id);

  return (
    <>
      {/* Preconnect рядом с инициализацией — чтобы соединение к mc.yandex.ru
          открылось ТОЛЬКО после accept в cookie-баннере. До согласия в DOM
          никакого ресурса с этого домена нет. */}
      <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="" />
      <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      <Script id="ym-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${counterId}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            defer: true,
            ecommerce: false
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
