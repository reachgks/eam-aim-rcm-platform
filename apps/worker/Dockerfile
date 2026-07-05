# ── Base ──
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ── Dependencies ──
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/worker/package.json ./apps/worker/
RUN pnpm install --frozen-lockfile

# ── Development ──
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 9229
CMD ["pnpm", "--filter", "@platform/worker", "dev"]

# ── Build ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @platform/worker build
RUN pnpm deploy --filter @platform/worker --prod /prod/worker

# ── Production ──
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S eam && adduser -S eam -u 1001
COPY --from=build --chown=eam:eam /prod/worker .
USER eam
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
