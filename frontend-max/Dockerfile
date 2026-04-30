# syntax=docker/dockerfile:1.7
#
# Build context MUST be the monorepo root (set in docker-compose.yml as
# `context: .` with `dockerfile: frontend-max/Dockerfile`). Required because
# the `shared` workspace package lives outside frontend-max/.

ARG NODE_VERSION=20.18

# ---------- deps ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /repo

# Manifests only — keeps `npm ci` cached when content changes.
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY frontend-max/package.json frontend-max/
COPY frontend-tg/package.json frontend-tg/
COPY frontend-web/package.json frontend-web/

RUN npm ci --no-audit --no-fund

# ---------- build ----------
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /repo

# NEXT_PUBLIC_* vars must be set during `next build` — Next inlines them into
# the client bundle and bakes them into SSG'd HTML. Pass via docker-compose
# `args:`. Defaults to empty so the build doesn't fail when an optional one
# (analytics, search-console verifications) isn't configured yet.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID=
ARG NEXT_PUBLIC_YANDEX_VERIFICATION=
ARG NEXT_PUBLIC_GOOGLE_VERIFICATION=
ARG NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Constrain V8 heap so `next build` survives on 1–2 GB VPS.
ENV NODE_OPTIONS=--max-old-space-size=1536
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=${NEXT_PUBLIC_YANDEX_METRIKA_ID}
ENV NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}
ENV NEXT_PUBLIC_GOOGLE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_VERIFICATION}
ENV NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=${NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY}

COPY --from=deps /repo/node_modules ./node_modules
COPY shared ./shared
COPY frontend-max ./frontend-max

WORKDIR /repo/frontend-max
RUN npm run build

# ---------- runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# next/standalone yields server.js + a trimmed node_modules tree.
COPY --from=build /repo/frontend-max/.next/standalone ./
COPY --from=build /repo/frontend-max/.next/static ./frontend-max/.next/static
COPY --from=build /repo/frontend-max/public ./frontend-max/public

# Drop privileges. node:alpine ships with a `node` user (uid 1000).
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "frontend-max/server.js"]
