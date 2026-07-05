# Deployment Guide

## Docker Production Deployment

### 1. Build Production Images

```bash
docker compose -f docker-compose.yml build
```

### 2. Configure Environment

```bash
# Create production .env
cp .env.example .env.production

# REQUIRED: Set secure values
JWT_SECRET=<generate-secure-256-bit-key>
POSTGRES_PASSWORD=<strong-password>
```

### 3. Deploy

```bash
docker compose -f docker-compose.yml up -d
```

### 4. Run Migrations

```bash
docker compose exec api pnpm --filter @platform/database migrate
```

## Health Checks

| Service | Endpoint | Expected |
|---------|----------|----------|
| API | `GET /health` | `{"status":"ok"}` |
| Telemetry | `GET /health` | `{"status":"ok"}` |
| PostgreSQL | `pg_isready` | exit 0 |
| Redis | `redis-cli ping` | PONG |

## Backup Strategy

```bash
# PostgreSQL backup (daily recommended)
docker compose exec postgres pg_dump -U eam_user eam_platform | gzip > backup_$(date +%Y%m%d).sql.gz

# Redis backup
docker compose exec redis redis-cli BGSAVE
```

## Scaling

- **API**: Scale horizontally behind a load balancer
- **Workers**: Increase `WORKER_CONCURRENCY` or add replicas
- **Telemetry**: Scale based on sensor count and data rate
- **PostgreSQL**: Use read replicas for analytics queries
- **TimescaleDB**: Continuous aggregates reduce query load
