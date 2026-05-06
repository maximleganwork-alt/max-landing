# syntax=docker/dockerfile:1.7
# Build context = monorepo root. See frontend-max/Dockerfile for layer notes.

ARG NODE_VERSION=20.18

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY frontend-max/package.json frontend-max/
COPY frontend-tg/package.json frontend-tg/
COPY frontend-web/package.json frontend-web/
RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /repo
# NEXT_PUBLIC_* must be present at `next build` — see frontend-max/Dockerfile.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID=
ARG NEXT_PUBLIC_YANDEX_VERIFICATION=
ARG NEXT_PUBLIC_GOOGLE_VERIFICATION=
ARG NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=1536
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=${NEXT_PUBLIC_YANDEX_METRIKA_ID}
ENV NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}
ENV NEXT_PUBLIC_GOOGLE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_VERIFICATION}
ENV NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=${NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY}
COPY --from=deps /repo/node_modules ./node_modules
COPY shared ./shared
COPY frontend-web ./frontend-web
WORKDIR /repo/frontend-web
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /repo/frontend-web/.next/standalone ./
COPY --from=build /repo/frontend-web/.next/static ./frontend-web/.next/static
COPY --from=build /repo/frontend-web/public ./frontend-web/public
RUN chown -R node:node /app
USER node
EXPOSE 3000

# Alpine содержит wget; у Next.js нет встроенного /healthz, поэтому
# пробуем GET / — Next отдаст 200 на главной.
# `--spider` не качает тело, отдаёт exit 0 при 2xx/3xx.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --spider -q http://127.0.0.1:3000/ || exit 1
CMD ["node", "frontend-web/server.js"]
