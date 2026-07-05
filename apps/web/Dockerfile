# ── Base ──
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ── Dependencies ──
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# ── Development ──
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "@platform/web", "dev"]

# ── Build ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @platform/web build

# ── Production ──
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S eam && adduser -S eam -u 1001
COPY --from=build --chown=eam:eam /app/apps/web/.next/standalone ./
COPY --from=build --chown=eam:eam /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=eam:eam /app/apps/web/public ./apps/web/public
USER eam
EXPOSE 3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["node", "apps/web/server.js"]
