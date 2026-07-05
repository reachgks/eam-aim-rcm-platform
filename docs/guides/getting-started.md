# Getting Started

## Prerequisites

- **Node.js** 20+ (with corepack enabled)
- **pnpm** 9+ (`corepack enable && corepack prepare pnpm@9 --activate`)
- **Docker** & **Docker Compose** v2+
- **Git**

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/reachgks/eam-aim-rcm-platform.git
cd eam-aim-rcm-platform

# 2. Copy environment variables
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Wait for services to be healthy
docker compose ps

# 5. Run database migrations
docker compose exec api pnpm --filter @platform/database migrate

# 6. Access the platform
# API:     http://localhost:3001
# Web:     http://localhost:3000
# pgAdmin: http://localhost:5050 (dev profile)
```

## Local Development (without Docker)

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL + Redis (use Docker for these)
docker compose up postgres redis mosquitto -d

# 3. Set environment variables
cp .env.example .env
# Edit .env with your local settings

# 4. Run database migrations
pnpm --filter @platform/database migrate

# 5. Start development servers
pnpm dev
# This starts: API (3001), Worker, Telemetry (3002)
```

## Project Structure

```
eam-aim-rcm-platform/
├── apps/
│   ├── api/              # Fastify REST API
│   ├── web/              # Next.js Frontend
│   ├── worker/           # BullMQ Background Jobs
│   └── telemetry-ingestion/  # IoT Data Ingestion
├── packages/
│   ├── database/         # Drizzle ORM Schemas (131 tables)
│   ├── shared-types/     # TypeScript type definitions
│   ├── validators/       # Zod validation schemas
│   └── utils/            # Shared utility functions
├── docker/               # Docker configurations
├── docs/                 # Documentation
├── docker-compose.yml    # Production-ready Docker Compose
└── turbo.json            # Turborepo pipeline config
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm --filter @platform/api dev` | Start API only |
| `pnpm --filter @platform/database migrate` | Run migrations |
| `pnpm --filter @platform/database generate` | Generate migration files |
| `pnpm --filter @platform/database studio` | Open Drizzle Studio |

## Environment Variables

See `.env.example` for all available configuration options. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://eam_user:eam_secret@localhost:5432/eam_platform` | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `JWT_SECRET` | (required) | JWT signing secret |
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker for telemetry |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
