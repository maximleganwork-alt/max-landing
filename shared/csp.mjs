/**
 * Content-Security-Policy для всех маркетинговых лендингов.
 *
 * Ключевые ослабления (без них ломается):
 *   - `'unsafe-inline'` в script-src → нужен для inline JSON-LD (`<script
 *     type="application/ld+json">`) и Yandex.Metrika init-скрипта. Полная
 *     миграция на nonce требует server-side hook'а в next/script — на dev
 *     с HMR выльется в постоянную перегенерацию nonce.
 *   - `'unsafe-inline'` в style-src → Tailwind генерит inline `style=` для
 *     CSS-variables и framer-motion использует inline стили для анимаций.
 *
 * Внешние домены:
 *   - `mc.yandex.ru`, `*.yandex.ru` → Метрика (после accept в cookie-баннере).
 *   - `smartcaptcha.yandexcloud.net` → SmartCaptcha (необходимый антиспам).
 *
 * `connect-src` намеренно широкий по yandex.* — Метрика бьётся в несколько
 * поддоменов (mc.yandex.com, yastatic.net и др.) при сборке статистики.
 */
export const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://*.yandex.ru https://smartcaptcha.yandexcloud.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://mc.yandex.ru https://*.yandex.ru https://smartcaptcha.yandexcloud.net",
  "font-src 'self' data:",
  "connect-src 'self' https://mc.yandex.ru https://*.yandex.ru https://smartcaptcha.yandexcloud.net",
  "frame-src 'self' https://smartcaptcha.yandexcloud.net",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");
