# System Architecture Overview

## EAM/AIM/RCM Platform — Enterprise Asset Management

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│   Next.js Web App │ Mobile App │ MQTT Devices │ External APIs    │
└──────────┬──────────────┬───────────┬────────────────┬──────────┘
           │              │           │                │
           ▼              ▼           ▼                ▼
┌──────────────────┐ ┌──────────┐ ┌────────────────────────────┐
│   API Gateway    │ │  WebSocket│ │  Telemetry Ingestion (3002)│
│  Fastify (3001)  │ │  Server   │ │  MQTT + HTTP Batch         │
│  ├── Auth/JWT    │ │           │ │  ├── Buffer/Batch Writer   │
│  ├── RBAC        │ │           │ │  └── Alert Engine          │
│  ├── Tenant RLS  │ │           │ └────────────────────────────┘
│  ├── Audit Trail │ │           │              │
│  └── CDE Engine  │ │           │              │
└────────┬─────────┘ └─────┬─────┘              │
         │                 │                    │
         ▼                 ▼                    ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SHARED DATA LAYER                             │
│  ┌─────────────────┐  ┌───────────────┐  ┌────────────────────┐ │
│  │ PostgreSQL 16   │  │ Redis 7       │  │ Object Storage     │ │
│  │ + TimescaleDB   │  │ ├── BullMQ    │  │ (IFC/Documents)    │ │
│  │ ├── 131 Tables  │  │ ├── Sessions  │  │                    │ │
│  │ ├── RLS Policies│  │ └── Cache     │  │                    │ │
│  │ └── Hypertables │  │               │  │                    │ │
│  └─────────────────┘  └───────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
         ▲
         │
┌────────┴─────────────────────────────────────────────────────────┐
│                    BACKGROUND WORKERS (BullMQ)                   │
│  ├── Maintenance Scheduler      ├── Depreciation Posting         │
│  ├── Reliability Calculator     ├── Cost Rollup Aggregation      │
│  ├── AIR Compliance Check       ├── Reorder Point Check          │
│  ├── SLA Breach Monitor         ├── Warranty Expiry Alert        │
│  ├── Data Quality Scanner       ├── Regulatory Deadline Check    │
│  ├── Weibull Recalculation      ├── IFC Model Parser             │
│  └── Telemetry Aggregation      └── CDE Notification Engine      │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React 18 | Server-rendered web dashboard |
| **API** | Fastify 4 | High-performance REST API |
| **ORM** | Drizzle ORM | Type-safe database access |
| **Database** | PostgreSQL 16 + TimescaleDB | Relational + time-series storage |
| **Queue** | BullMQ + Redis | Background job processing |
| **Cache** | Redis 7 | Session, cache, pub/sub |
| **Telemetry** | MQTT (Mosquitto) | IoT sensor data ingestion |
| **Containerization** | Docker + Docker Compose | Development & deployment |
| **Build** | Turborepo + pnpm | Monorepo management |
| **Validation** | Zod | Runtime input validation |
| **Auth** | JWT + SSO (SAML/OIDC) | Authentication & authorization |

### Module Map (22 Domains)

1. **Core** — Tenants, Users, Roles, Audit Log, RLS
2. **Auth** — Sessions, SSO, API Keys, MFA
3. **Asset Register** — Assets, Types, Hierarchy, Locations, Lifecycle
4. **CDE** — Documents, CDE States, Workflows, Handover, Digital Twin
5. **OIR/AIR** — Info Requirements, LOIN, Compliance Checks
6. **Maintenance** — Work Orders, Plans, Tasks, Routes, Shutdowns
7. **Labor** — Crafts, Crews, Shifts, Certifications, Bookings
8. **Inventory** — Storerooms, Stock, BOM, Cycle Counts, Reorder
9. **Procurement** — Vendors, POs, Goods Receipts, Invoice Matching
10. **Warranty** — Terms, Coverage, Claims
11. **SLA** — Definitions, Targets, Tracking, Breaches
12. **Contractors** — Companies, Contracts, Personnel, Safety
13. **Safety** — Permits, LOTO, Isolation Points, Observations
14. **Financials** — Cost Centers, Budgets, Depreciation, Cost Rollup, Replacement Analysis
15. **Projects** — Capital Projects, Phases, Tasks, MOC
16. **Service Requests** — Requests, Categories, Comments
17. **RCM** — Functions, FMEA, P-F Curves, Weibull, RAM, Task Packaging
18. **Classification** — Uniclass, ISO 14224, Failure/Cause Codes
19. **Telemetry** — Sensors, Readings (Hypertable), Alerts, Aggregates
20. **BIM** — IFC Models, Elements, Asset Links, Versions
21. **Regulatory** — Regulations, Inspections, Violations, CAPA, Audits
22. **Performance** — Condition Assessments, Meters, KPIs

### Multi-Tenancy Architecture

- **Row-Level Security (RLS)**: Every table includes `tenant_id` column
- **Session Context**: PostgreSQL `app.current_tenant_id` session variable
- **API Middleware**: Automatic tenant injection from JWT or header
- **Data Isolation**: RLS policies prevent cross-tenant data access

### Standards Compliance

| Standard | Domain |
|----------|--------|
| ISO 55000 | Asset Management System |
| ISO 19650 | Information Management (BIM/CDE) |
| ISO 14224 | Equipment Reliability & Maintenance Data |
| SAE JA1011 | RCM Criteria |
| EN 17412 | Level of Information Need (LOIN) |
| IFC4 | Building Information Modeling |
