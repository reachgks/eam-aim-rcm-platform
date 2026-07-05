# ── Base ──
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ── Dependencies ──
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validators/package.json ./packages/validators/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# ── Development ──
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/
COPY --from=deps /app/apps/api/node_modules ./apps/api/
COPY . .
EXPOSE 3001
CMD ["pnpm", "--filter", "@platform/api", "dev"]

# ── Build ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @platform/api build
RUN pnpm deploy --filter @platform/api --prod /prod/api

# ── Production ──
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S eam && adduser -S eam -u 1001
COPY --from=build --chown=eam:eam /prod/api .
USER eam
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
