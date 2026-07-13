# EAM/AIM/RCM Platform — Complete Design Document

> **Version**: 1.0 · **Last Updated**: 2026-07-13
> **Repository**: https://github.com/reachgks/eam-aim-rcm-platform.git
> **Purpose**: This document is the single source of truth for any AI coding agent or developer to understand, extend, or modify any part of the platform.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Database Layer](#4-database-layer)
5. [API Layer](#5-api-layer)
6. [Middleware Pipeline](#6-middleware-pipeline)
7. [Service Layer](#7-service-layer)
8. [Background Workers](#8-background-workers)
9. [Telemetry Ingestion](#9-telemetry-ingestion)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Infrastructure & Deployment](#11-infrastructure--deployment)
12. [Authentication & Authorization](#12-authentication--authorization)
13. [Data Patterns & Conventions](#13-data-patterns--conventions)
14. [Testing Strategy](#14-testing-strategy)
15. [Extension Guide](#15-extension-guide)

---

## 1. System Overview

### What This Platform Does

An enterprise-grade **Enterprise Asset Management (EAM)** platform with **Asset Information Management (AIM)** for ISO 19650 BIM compliance and **Reliability-Centered Maintenance (RCM)** analytics. Designed for industrial facilities managing rotating/static equipment, electrical systems, instrumentation, and civil infrastructure.

### Key Capabilities

| Domain | Capability |
|--------|-----------|
| **Asset Register** | Full lifecycle management: procurement → install → operate → decommission → dispose |
| **Maintenance** | Work orders, PM/PdM plans, tasks, spare parts, approval workflows |
| **Inventory** | Stock items, storerooms, transactions, BOM, reorder-point automation |
| **Procurement** | Vendors, purchase requisitions, POs with line items, goods receipts |
| **Financials** | Cost centers, budgets, depreciation (straight-line/declining-balance), cost rollup |
| **Telemetry** | IoT sensor data ingestion (HTTP + MQTT), TimescaleDB time-series, alert rules |
| **RCM** | FMEA, failure events, RCM decisions, Weibull analysis, RAM, criticality, RCA |
| **Safety** | Work permits (hot work, confined space, electrical), LOTO, safety observations |
| **Regulatory** | Regulations, compliance requirements, inspections, violations, CAPA, audit reports |
| **CDE** | ISO 19650 Common Data Environment: containers, state machine, revision history, handover |
| **BIM** | IFC model management, element extraction, element-asset linking |
| **OIR/AIR** | Organizational/Asset Information Requirements, LOIN, compliance checks |
| **SLA** | SLA definitions with targets per priority, breach detection, tracking |
| **Warranty** | Warranty terms, coverage per asset, claims |
| **Labor** | Crafts, crews, shifts, bookings, rates, certifications |
| **Projects** | Capital projects, phases, tasks, management of change (MOC) |
| **Service Requests** | Self-service portal: categories, requests, comments |
| **Performance** | KPI definitions, condition assessments, meter readings |
| **Reports** | Cross-module analytics with raw SQL aggregations |

---

## 2. Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                    │
│   Next.js Web App (:3000)  │  Mobile App  │  External Systems     │
└──────────────┬───────────────────┬──────────────────┬────────────┘
               │                   │                  │
               ▼                   ▼                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Fastify :3001)                     │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │
│  │JWT Auth │→│Tenant RLS│→│RBAC Guard│→│Route → Service → DB│   │
│  └─────────┘ └──────────┘ └──────────┘ └────────────────────┘   │
│                                              │ Audit Log (async) │
└──────────────────────────────────────────────┬───────────────────┘
               │                               │
    ┌──────────┼──────────────┐                │
    ▼          ▼              ▼                ▼
┌────────┐ ┌────────┐ ┌────────────┐ ┌─────────────────────────┐
│Postgres│ │ Redis  │ │  MQTT      │ │Telemetry Ingestion:3002 │
│16 +    │ │7-alpine│ │ Mosquitto  │ │(HTTP batch → TimescaleDB)│
│Timescale│ │        │ │            │ └─────────────────────────┘
└────────┘ └────────┘ └────────────┘
    ▲                      ▲
    │                      │
┌────────────────────────────────────────────┐
│        BACKGROUND WORKERS (BullMQ)          │
│  15 job processors with cron schedules      │
│  maintenance-scheduler │ reliability-calc   │
│  sla-breach-check │ reorder-point │ ...     │
└────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | ≥ 20.x |
| **Package Manager** | pnpm | ≥ 9.x |
| **Monorepo** | Turborepo | 2.4.x |
| **API Framework** | Fastify | 5.3.x |
| **ORM** | Drizzle ORM | 0.44.x |
| **Database** | PostgreSQL + TimescaleDB | 16.x |
| **Cache / Queues** | Redis | 7.x |
| **Job Processing** | BullMQ | 5.52.x |
| **Auth** | @fastify/jwt + bcrypt | JWT RS256 |
| **MQTT** | Eclipse Mosquitto | 2.x |
| **Frontend** | Next.js 14 (App Router) | 14.2.x |
| **UI** | React 18 + Tailwind CSS 3 | 18.3.x |
| **State** | Zustand + TanStack React Query v5 | — |
| **Charts** | Recharts | 2.12.x |
| **CI/CD** | GitHub Actions | 3 workflows |
| **Containers** | Docker Compose | 7 services |

---

## 3. Monorepo Structure

```
eam-aim-rcm-platform/
├── apps/
│   ├── api/                          ← Fastify REST API (:3001)
│   │   ├── src/
│   │   │   ├── index.ts              ← Server bootstrap, route registration
│   │   │   ├── middleware/            ← 4 middleware plugins
│   │   │   │   ├── auth.middleware.ts     ← JWT verification (public path bypass)
│   │   │   │   ├── tenant.middleware.ts   ← x-tenant-id → RLS context
│   │   │   │   ├── rbac.middleware.ts     ← DB role lookup + cache + permission guard
│   │   │   │   └── audit.middleware.ts    ← Fire-and-forget INSERT to audit_log
│   │   │   ├── routes/                ← 21 route modules (120+ endpoints)
│   │   │   ├── services/              ← 21 service classes with Drizzle queries
│   │   │   └── routes/*.test.ts       ← 6 integration test files
│   │   ├── vitest.config.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── worker/                        ← BullMQ background processor
│   │   ├── src/index.ts               ← 15 job processors + cron schedules
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── telemetry-ingestion/           ← High-throughput sensor data service (:3002)
│   │   ├── src/index.ts               ← Buffer → batch INSERT to TimescaleDB
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                           ← Next.js frontend (:3000) [NOT YET BUILT]
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── database/                      ← Drizzle schemas, client, migrations, seed
│   │   ├── src/
│   │   │   ├── client.ts              ← pg Pool + setTenantContext() + health check
│   │   │   ├── migrate.ts             ← Programmatic migration runner
│   │   │   ├── seed.ts                ← 20-module demo data (465 lines)
│   │   │   └── schema/                ← 140 TypeScript schema files
│   │   │       ├── index.ts           ← Barrel export of all tables
│   │   │       ├── relations.ts       ← Drizzle relation definitions
│   │   │       └── <22 subdirectories>
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── shared-types/                  ← Cross-package TypeScript types
│   ├── validators/                    ← Zod validation schemas
│   └── utils/                         ← Shared utility functions
│
├── docker/
│   ├── postgres/
│   │   ├── Dockerfile                 ← PostgreSQL 16 + TimescaleDB extension
│   │   └── init.sql                   ← UUID extension, RLS setup
│   └── mosquitto/
│       └── mosquitto.conf
│
├── .github/workflows/
│   ├── ci.yml                         ← Lint + typecheck + test + build
│   ├── cd-staging.yml                 ← Build Docker → push to GHCR → deploy staging
│   └── cd-production.yml              ← Tag-triggered production deploy
│
├── docker-compose.yml                 ← 7 services (postgres, redis, api, worker, web, telemetry, mosquitto)
├── turbo.json                         ← Task pipeline configuration
├── package.json                       ← Root monorepo scripts
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## 4. Database Layer

### Connection

**File**: `packages/database/src/client.ts`

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// Sets PostgreSQL session variable for Row-Level Security
export async function setTenantContext(tenantId: string) {
  await pool.query(`SET app.current_tenant_id = '${tenantId}'`);
}

export async function checkDatabaseHealth() {
  try {
    await pool.query('SELECT 1');
    return { connected: true };
  } catch { return { connected: false }; }
}

export async function closeDatabaseConnection() { await pool.end(); }
```

**Exports**: `db`, `pool`, `setTenantContext`, `checkDatabaseHealth`, `closeDatabaseConnection`
**Import pattern**: `import { db } from '@eamaim/database'`
**Schema import**: `import { assets, workOrders } from '@eamaim/database/schema'`

### Complete Schema Catalog (140 files, 22 modules)

#### Core (5 tables)

| Table | File | Key Columns | Notes |
|-------|------|-------------|-------|
| `tenants` | `core/tenants.ts` | id, name, slug, domain, plan, settings, isActive | Multi-tenant root |
| `users` | `core/users.ts` | id, tenantId, email, passwordHash, firstName, lastName, role, isActive | bcrypt hashed |
| `roles` | `core/roles-permissions.ts` | id, tenantId, name, permissions (jsonb), isActive | RBAC roles |
| `role_assignments` | `core/roles-permissions.ts` | userId, roleId, tenantId | Junction table (composite PK) |
| `audit_log` | `core/audit-log.ts` | id, tenantId, userId, action (enum), entityType, entityId, oldValues, newValues, ipAddress | Immutable audit trail |

**Audit Action Enum**: `CREATE`, `UPDATE`, `DELETE`, `ARCHIVE`, `RESTORE`, `LOGIN`, `LOGOUT`, `EXPORT`, `IMPORT`, `APPROVE`, `REJECT`, `STATUS_CHANGE`

**Permission Enum** (44 values): `ASSET_CREATE`, `ASSET_READ`, `ASSET_UPDATE`, `ASSET_DELETE`, `ASSET_DECOMMISSION`, `WORK_ORDER_CREATE`, `WORK_ORDER_READ`, `WORK_ORDER_UPDATE`, `WORK_ORDER_APPROVE`, `WORK_ORDER_CLOSE`, `INVENTORY_READ`, `INVENTORY_UPDATE`, `INVENTORY_ADJUST`, `PROCUREMENT_REQUEST`, `PROCUREMENT_APPROVE`, `PROCUREMENT_READ`, `REPORT_VIEW`, `REPORT_CREATE`, `REPORT_EXPORT`, `ADMIN_USERS`, `ADMIN_ROLES`, `ADMIN_SETTINGS`, `ADMIN_BILLING`, `ADMIN_INTEGRATIONS`, `SAFETY_READ`, `SAFETY_CREATE`, `SAFETY_APPROVE`, `FINANCIAL_READ`, `FINANCIAL_APPROVE`

---

#### Asset Register (7 tables)

| Table | File | Key Columns |
|-------|------|-------------|
| `asset_types` | `asset-types.ts` | id, tenantId, code, name, parentTypeId, category, defaultAttributes |
| `functional_locations` | `functional-locations.ts` | id, tenantId, code, name, parentId, locationType (SITE/BUILDING/ZONE/ROOM), coordinates |
| `assets` | `assets.ts` | id, tenantId, tagNumber, name, assetTypeId, functionalLocationId, parentAssetId, serialNumber, manufacturer, model, installDate, commissionDate, status, criticality, metadata |
| `asset_attributes` | `asset-attributes.ts` | id, assetId, attributeKey, attributeValue |
| `asset_classification` | `asset-classification.ts` | id, assetId, classificationSystem, classCode |
| `asset_hierarchy` | `asset-hierarchy.ts` | id, parentId, childId, hierarchyType |
| `asset_lifecycle` | `asset-lifecycle.ts` | id, assetId, event, eventDate, details |

**Asset Status Enum**: `PLANNED`, `ORDERED`, `RECEIVED`, `INSTALLED`, `COMMISSIONING`, `ACTIVE`, `STANDBY`, `OUT_OF_SERVICE`, `DECOMMISSIONED`, `DISPOSED`

**Criticality Enum**: `A` (Critical), `B` (Important), `C` (Standard), `D` (Non-critical)

---

#### Maintenance (11 tables)

| Table | File | Key Columns |
|-------|------|-------------|
| `work_orders` | `work-orders.ts` | id, tenantId, woNumber, type, priority, status, assetId, description, scheduledStart/End, actualStart/End, assignedTo, plannerUserId, maintenancePlanId, actualHours, actualCost |
| `maintenance_tasks` | `maintenance-tasks.ts` | id, tenantId, workOrderId, sequence, description, estimatedHours, status |
| `maintenance_plans` | `maintenance-plans.ts` | id, tenantId, planCode, name, assetId, planType, frequencyValue, frequencyUnit, isActive |
| `spare_parts` | `spare-parts.ts` | id, workOrderId, stockItemId, quantityUsed, unitCost |
| `maintenance_history` | `maintenance-history.ts` | id, assetId, workOrderId, action, fromStatus, toStatus |
| `work_order_approvals` | `work-order-approvals.ts` | id, workOrderId, approverId, decision, comments |
| `maintenance_routes` | `maintenance-routes.ts` | id, name, description, routeType |
| `route_stops` | `route-stops.ts` | id, routeId, assetId, sequence, inspectionPoints |
| `route_executions` | `route-executions.ts` | id, routeId, executedBy, startTime, endTime |
| `shutdown_events` | `shutdown-events.ts` | id, name, startDate, endDate, status |
| `shutdown_scope_items` | `shutdown-scope-items.ts` | id, shutdownId, workOrderId |

**WO Type Enum**: `PREVENTIVE`, `CORRECTIVE`, `PREDICTIVE`, `EMERGENCY`, `CONDITION_BASED`, `PROJECT`

**WO Status Enum**: `DRAFT`, `PLANNED`, `APPROVED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`, `CLOSED`

**WO Priority Enum**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`

---

#### Inventory (7 tables)

| Table | Key Columns |
|-------|-------------|
| `storerooms` | id, tenantId, code, name, siteId, isActive |
| `stock_items` | id, tenantId, itemCode, name, category, unitCost, unitOfMeasure |
| `stock_levels` | id, tenantId, stockItemId, storeroomId, quantityOnHand, minimumQuantity |
| `stock_transactions` | id, tenantId, stockItemId, storeroomId, transactionType (RECEIPT/ISSUE/ADJUST/TRANSFER), quantity, reference |
| `reorder_rules` | id, tenantId, stockItemId, reorderPoint, reorderQuantity, leadTimeDays |
| `bill_of_materials` | id, tenantId, assetId, stockItemId, quantity |
| `cycle_counts` | id, tenantId, storeroomId, countDate, status |

---

#### Procurement (7 tables)

| Table | Key Columns |
|-------|-------------|
| `vendors` | id, tenantId, code, name, category, contactName/Email/Phone, isActive |
| `purchase_requisitions` | id, tenantId, reqNumber, status, requestedBy, description, priority |
| `purchase_orders` | id, tenantId, poNumber, vendorId, status, totalAmount, approvedBy |
| `po_line_items` | id, purchaseOrderId, stockItemId, quantity, unitPrice, lineTotal |
| `goods_receipts` | id, tenantId, purchaseOrderId, receivedBy, receiptDate |
| `invoice_matching` | id, tenantId, purchaseOrderId, invoiceNumber, amount |
| `vendor_ratings` | id, tenantId, vendorId, ratingCategory, score |

---

#### Financials (9 tables)

| Table | Key Columns |
|-------|-------------|
| `cost_centers` | id, tenantId, code, name, parentId, isActive |
| `budgets` | id, tenantId, costCenterId, fiscalYear, totalBudget, approvedBy, status |
| `budget_line_items` | id, budgetId, category, amount |
| `cost_transactions` | id, tenantId, sourceType, sourceId, assetId, costCenterId, transactionDate, amount, costCategory |
| `depreciation_profiles` | id, tenantId, assetId, method (STRAIGHT_LINE/DECLINING_BALANCE), originalCost, salvageValue, usefulLifeMonths, startDate, costCenterId |
| `depreciation_schedule` | id, tenantId, profileId, periodNumber, depreciationAmount, accumulatedDepreciation, bookValue, isPosted |
| `asset_cost_rollup` | id, tenantId, assetId, periodType, periodStart/End, laborCost, materialCost, serviceCost, overheadCost, depreciationCost, totalCost |
| `asset_valuations` | id, tenantId, assetId, valuationType, currentValue, assessmentDate |
| `replacement_analysis` | id, tenantId, assetId, replacementCost, annualMaintenanceCost, recommendedAction |

**Cost Category Enum**: `LABOR`, `MATERIAL`, `SERVICE`, `OVERHEAD`, `DEPRECIATION`, `OTHER`

---

#### Telemetry (7 tables)

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `sensor_registry` | id, tenantId, assetId, sensorCode, name, sensorType, unit | Sensor metadata |
| `sensor_readings` | sensorId, tenantId, time, value, quality | **TimescaleDB hypertable** |
| `alert_rules` | id, tenantId, sensorId, condition, threshold, severity | e.g. value > 85 |
| `alert_history` | id, tenantId, sensorId, ruleId, alertValue, severity, acknowledgedAt | Alert log |
| `telemetry_events` | id, tenantId, sensorId, eventType, severity, message, value | Alarms/state changes |
| `continuous_aggregates` | — | TimescaleDB materialized views |
| `data_points` | id, sensorId, time, value | Alternative point storage |

---

#### RCM — Reliability-Centered Maintenance (14 tables)

| Table | Key Columns |
|-------|-------------|
| `functions` | id, tenantId, assetId, name, description, performanceStandard |
| `functional_failures` | id, functionId, name, description |
| `failure_modes` | id, functionalFailureId, code, name, effect, severity, detectability |
| `fmea_analysis` | id, tenantId, assetId, rpn (Risk Priority Number) |
| `failure_events` | id, tenantId, assetId, failureDate, failureModeId, rootCause, downtime |
| `rcm_decisions` | id, tenantId, failureModeId, taskType, interval, justification |
| `criticality_analysis` | id, tenantId, assetId, consequenceScore, likelihoodScore, riskScore |
| `reliability_metrics` | id, tenantId, assetId, calculationDate, periodMonths, mtbf, mttr, availability, failureCount |
| `root_cause_analysis` | id, tenantId, failureEventId, method, findings |
| `rca_contributing_factors` | id, rcaId, factorType, description |
| `weibull_analysis` | id, tenantId, assetId, analysisDate, betaShape, etaScale, dataPoints, method |
| `ram_analysis` | id, tenantId, assetId, reliability, availability, maintainability |
| `pf_curves` | id, tenantId, assetId, pfInterval, inspectionInterval |
| `task_packages` | id, tenantId, assetId, name, tasks (jsonb) |

---

#### Safety (5 tables)

| Table | Key Columns |
|-------|-------------|
| `permit_types` | id, tenantId, code, name, requiresGasTest, maxDurationHours |
| `work_permits` | id, tenantId, permitNumber, permitTypeId, status, assetId, validFrom, expiryDate, issuedBy |
| `isolation_points` | id, permitId, pointType, location, method |
| `loto_procedures` | id, tenantId, assetId, steps (jsonb), lastReviewDate |
| `safety_observations` | id, tenantId, observationType, description, severity, reportedBy |

---

#### Regulatory (7 tables)

| Table | Key Columns |
|-------|-------------|
| `regulations` | id, tenantId, code, name, authority, jurisdiction, isActive |
| `compliance_requirements` | id, tenantId, regulationId, code, name, requirementType, frequencyDays, isActive |
| `inspections` | id, tenantId, requirementId, assetId, inspectionDate, result, inspectorName |
| `violations` | id, tenantId, regulationId, violationDate, severity, description, status |
| `corrective_actions` | id, tenantId, violationId, actionType, description, dueDate, completedDate, status |
| `audit_reports` | id, tenantId, auditDate, auditType, findings, auditor |
| `requirement_asset_map` | requirementId, assetId | Junction |

---

#### CDE — Common Data Environment (9 tables)

| Table | Key Columns |
|-------|-------------|
| `information_containers` | id, tenantId, containerCode, name, state (WIP/SHARED/PUBLISHED/ARCHIVED), ownerId |
| `cde_states` | id, containerId, fromState, toState, changedBy, changedAt |
| `revision_history` | id, containerId, revisionNumber, description, createdBy |
| `document_registry` | id, tenantId, containerId, documentName, fileType, version |
| `cde_workflows` | id, tenantId, name, steps (jsonb) |
| `data_dictionary` | id, tenantId, term, definition, domain |
| `data_quality` → `data_quality_rules` | id, tenantId, ruleName, ruleLogic |
| `data_quality` → `data_quality_scores` | id, tenantId, entityType, entityId, score, missingFields |
| `digital_twin` | id, tenantId, assetId, twinType, connectionUrl |
| `handover_management` → `handover_packages` / `handover_items` | id, tenantId, packageName, status |

---

#### Additional Modules

| Module | Tables | Files |
|--------|:------:|:-----:|
| **Auth** (sessions, API keys, MFA, SSO) | 4 | `auth/` |
| **BIM** (IFC models, elements, asset links) | 4 | `bim/` |
| **OIR/AIR** (info requirements, IDPs, LOIN) | 6 | `oir-air/` |
| **Classification** (Uniclass, failure codes, cause codes, ISO 14224) | 4 | `classification/` |
| **Contractors** (contractors, contracts, line items, personnel, safety) | 5 | `contractors/` |
| **Labor** (crafts, crews, crew members, shifts, bookings, rates, certifications, availability) | 8 | `labor/` |
| **Performance** (KPI definitions, KPI results, condition assessments, meter readings) | 4 | `performance/` |
| **Projects** (capital projects, phases, tasks, MOC, MOC approvals) | 5 | `projects/` |
| **Service Requests** (categories, requests, comments) | 3 | `service-requests/` |
| **SLA** (definitions, targets, breaches, tracking) | 4 | `sla/` |
| **Warranty** (terms, coverage, claims) | 3 | `warranty/` |

---

## 5. API Layer

### Server Configuration

**File**: `apps/api/src/index.ts`

```
Framework:  Fastify 5.3.x
Port:       3001 (configurable via PORT env)
Logger:     Pino (pino-pretty in development)
Plugins:    @fastify/cors, @fastify/jwt, @fastify/swagger, @fastify/rate-limit, @fastify/helmet
```

### Request Lifecycle

```
Request → CORS → JWT Verify → Tenant Extract → RLS Context → RBAC Load → Route Handler → Audit Log
```

### Complete API Endpoint Catalog

All endpoints are prefixed with `/api/v1/`. Every mutating operation (POST/PUT/PATCH/DELETE) is automatically audit-logged.

---

#### Auth (`/api/v1/auth`)

| Method | Path | Service Method | Request Body | Response |
|--------|------|----------------|-------------|----------|
| `POST` | `/login` | `authService.login()` | `{ email, password }` | `{ user, token, refreshToken, expiresAt }` |
| `POST` | `/refresh` | `authService.refresh()` | `{ refreshToken }` | `{ token, refreshToken, expiresAt }` |
| `POST` | `/logout` | `authService.logout()` | — (Bearer token) | `{ success: true }` |
| `GET` | `/me` | `authService.getCurrentUser()` | — (JWT required) | `{ user + permissions }` |

---

#### Assets (`/api/v1/assets`)

| Method | Path | Service Method | Params/Body |
|--------|------|----------------|-------------|
| `GET` | `/` | `assetService.findAll()` | `?page=&limit=&search=&status=&criticality=` |
| `GET` | `/:id` | `assetService.findById()` | — |
| `GET` | `/:id/hierarchy` | `assetService.getHierarchy()` | Recursive CTE query |
| `GET` | `/summary/status` | `assetService.getStatusSummary()` | — |
| `GET` | `/summary/criticality` | `assetService.getCriticalitySummary()` | — |
| `POST` | `/` | `assetService.create()` | `{ tagNumber, name, assetTypeId, ...}` |
| `PUT` | `/:id` | `assetService.update()` | Partial asset fields |
| `DELETE` | `/:id` | `assetService.delete()` | Soft delete → status=DISPOSED |

**Response format** (all list endpoints):
```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 156, "totalPages": 8 }
}
```

---

#### Maintenance (`/api/v1/maintenance`)

| Method | Path | Service | Notes |
|--------|------|---------|-------|
| `GET` | `/work-orders` | `maintenanceService.findAllWorkOrders()` | `?status=&type=&priority=&page=&limit=` |
| `GET` | `/work-orders/summary` | `maintenanceService.getWorkOrderDashboard()` | Returns `{ byStatus, byType, byPriority }` |
| `GET` | `/work-orders/:id` | `maintenanceService.findWorkOrderById()` | Includes tasks + spare parts |
| `POST` | `/work-orders` | `maintenanceService.createWorkOrder()` | Auto-generates `WO-XXXXXX` number |
| `PUT` | `/work-orders/:id` | `maintenanceService.updateWorkOrder()` | — |
| `PATCH` | `/work-orders/:id/status` | `maintenanceService.updateWorkOrderStatus()` | `{ status }` — validates transitions, writes history |
| `POST` | `/work-orders/:id/tasks` | `maintenanceService.addTask()` | `{ sequence, description, estimatedHours }` |
| `POST` | `/work-orders/:id/spare-parts` | `maintenanceService.addSparePart()` | `{ stockItemId, quantity }` |
| `GET` | `/plans` | `maintenanceService.getPlans()` | PM/PdM plans |
| `POST` | `/plans` | `maintenanceService.createPlan()` | — |

---

#### Inventory (`/api/v1/inventory`)

| Method | Path | Service | Notes |
|--------|------|---------|-------|
| `GET` | `/stock-items` | `inventoryService.findAll()` | `?page=&limit=&search=&category=` |
| `GET` | `/stock-items/:id` | `inventoryService.findById()` | — |
| `POST` | `/stock-items` | `inventoryService.create()` | — |
| `PUT` | `/stock-items/:id` | `inventoryService.update()` | — |
| `POST` | `/transactions` | `inventoryService.createTransaction()` | Auto-updates `stock_levels.quantity_on_hand` |
| `GET` | `/storerooms` | `inventoryService.getStorerooms()` | — |
| `GET` | `/bom/:assetId` | `inventoryService.getBom()` | Bill of materials |
| `GET` | `/reorder-alerts` | `inventoryService.getReorderAlerts()` | Items where qty ≤ reorder_point |

---

#### Procurement (`/api/v1/procurement`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/vendors` | `?search=&category=` |
| `POST` | `/vendors` | Create vendor |
| `PUT` | `/vendors/:id` | Update vendor |
| `POST` | `/requisitions` | Auto-generates `PR-XXXXXX` |
| `GET` | `/purchase-orders` | PO list |
| `GET` | `/purchase-orders/:id` | Detail + line items |
| `POST` | `/purchase-orders` | Auto-generates `PO-XXXXXX` with line items |
| `POST` | `/goods-receipts` | Record goods receipt |

---

#### Financials (`/api/v1/financials`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/depreciation/profiles` | All profiles |
| `POST` | `/depreciation/profiles` | Create depreciation profile |
| `GET` | `/depreciation/schedule/:profileId` | Schedule entries |
| `POST` | `/depreciation/schedule/post` | Post current period (creates cost_transaction) |
| `GET` | `/valuations` | Asset valuations |
| `POST` | `/valuations` | Create valuation |
| `GET` | `/cost-rollup` | `?assetId=` |
| `GET` | `/cost-rollup/calculate` | Trigger on-demand calculation |
| `GET` | `/transactions` | `?assetId=&costCategory=` |
| `GET` | `/cost-centers` | Cost center tree |
| `GET` | `/budgets` | `?fiscalYear=` |
| `GET` | `/replacement-analysis` | `?assetId=` |
| `POST` | `/replacement-analysis` | Create analysis |

---

#### Telemetry (`/api/v1/telemetry`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/sensors` | Paginated sensor list |
| `POST` | `/sensors` | Register sensor |
| `GET` | `/readings/:sensorId` | Raw readings `?from=&to=` |
| `GET` | `/readings/:sensorId/aggregated` | TimescaleDB `time_bucket()` aggregation `?bucket=1h&from=&to=` |
| `GET` | `/alerts` | Active alerts |
| `PATCH` | `/alerts/:id/acknowledge` | Acknowledge alert |
| `GET` | `/alert-rules` | Rule list |
| `POST` | `/alert-rules` | Create rule |
| `GET` | `/events` | Telemetry events |

---

#### RCM (`/api/v1/rcm`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/fmea/:assetId` | Full FMEA: functions → failures → modes |
| `POST` | `/functions` | Create function |
| `POST` | `/fmea` | Create failure mode |
| `GET` | `/failure-events` | Failure event log |
| `POST` | `/failure-events` | Record failure |
| `GET` | `/decisions` | RCM decisions |
| `POST` | `/decisions` | Create decision |
| `GET` | `/criticality/:assetId` | Criticality analysis |
| `GET` | `/reliability/:assetId` | MTBF/MTTR/Availability |
| `GET` | `/rca` | Root cause analyses |
| `POST` | `/rca` | Create RCA |
| `GET` | `/weibull` | Weibull analysis list |
| `GET` | `/ram` | RAM analysis |

---

#### Safety (`/api/v1/safety`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/permits` | Paginated `?status=` |
| `GET` | `/permits/:id` | Detail + isolation points |
| `POST` | `/permits` | Create permit |
| `PATCH` | `/permits/:id/status` | Status change |
| `GET` | `/permit-types` | Types list |
| `GET` | `/loto` | LOTO procedures `?assetId=` |
| `POST` | `/observations` | Create observation |
| `GET` | `/observations` | Observation log |

---

#### Regulatory (`/api/v1/regulatory`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/regulations` | All regulations |
| `GET` | `/requirements` | `?regulationId=` |
| `GET` | `/inspections` | Inspection log |
| `POST` | `/inspections` | Record inspection |
| `GET` | `/violations` | Violations |
| `POST` | `/violations` | Create violation |
| `GET` | `/corrective-actions` | CAPA list |
| `POST` | `/corrective-actions` | Create CAPA |
| `GET` | `/audit-reports` | Audit report list |
| `GET` | `/dashboard` | Returns `{ totalRequirements, overdueCount, openViolations, upcomingInspections, complianceRate }` |

---

#### Additional Route Modules

| Prefix | Endpoints | Notes |
|--------|:---------:|-------|
| `/api/v1/cde` | 7 | Containers, state transitions, revisions, handover |
| `/api/v1/bim` | 5 | IFC models, elements, element-asset links |
| `/api/v1/oir-air` | 7 | OIR, AIR, compliance checks, IDPs, LOIN |
| `/api/v1/labor` | 9 | Crafts, crews, bookings, rates, shifts, certifications |
| `/api/v1/projects` | 5 | Capital projects, MOC |
| `/api/v1/service-requests` | 5 | Requests, comments, categories |
| `/api/v1/sla` | 5 | Definitions, targets, summary, breaches |
| `/api/v1/warranty` | 5 | Terms, coverage, claims |
| `/api/v1/contractors` | 5 | Contractors, contracts, personnel |
| `/api/v1/tenants` | 5 | CRUD + slug lookup |

---

#### Reports (`/api/v1/reports`) — Cross-Module Analytics

| Path | SQL Logic |
|------|-----------|
| `/assets/summary` | Groups by status + criticality |
| `/maintenance/kpis` | WO counts by status, avg completion time, overdue % |
| `/financials/cost-summary` | SUM by cost_category from cost_transactions |
| `/inventory/valuation` | SUM(qty × unit_cost) GROUP BY storeroom |
| `/regulatory/compliance` | passed/failed/total inspections, open violations |

---

## 6. Middleware Pipeline

Middleware executes as Fastify hooks in this order:

### 1. Auth Middleware (`auth.middleware.ts`)

```
onRequest → Check if URL is public path → If not, call request.jwtVerify()
```

**Public paths** (bypass JWT):
- `/health`
- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/sso/callback`

### 2. Tenant Middleware (`tenant.middleware.ts`)

```
onRequest → Extract tenantId from:
  1. x-tenant-id header (priority)
  2. JWT payload tenantId (fallback)
→ Set request.tenantId
→ (Optional) SET app.current_tenant_id for RLS
```

### 3. RBAC Middleware (`rbac.middleware.ts`)

```
onRequest → If user authenticated:
  → Resolve permissions from DB (role_assignments → roles)
  → Cache for 5 minutes (keyed by userId:tenantId)
  → Set request.permissions = ['ASSET_CREATE', 'ASSET_READ', ...]
```

**Route-level guard**:
```typescript
server.get('/admin', { preHandler: requirePermission('ADMIN_USERS') }, handler)
```

**Permission matching**:
- Direct: `ASSET_CREATE` matches `ASSET_CREATE`
- Wildcard: `ASSETS:*` matches any `ASSET_*` permission
- Super-admin: `ADMIN:*` matches everything

**Cache invalidation**: `invalidatePermissionCache(userId, tenantId)` or `clearPermissionCache()`

### 4. Audit Middleware (`audit.middleware.ts`)

```
onResponse → If method is POST/PUT/PATCH/DELETE:
  → Extract entityType + entityId from URL
  → Fire-and-forget INSERT into audit_log (non-blocking)
  → Also log to stdout via Pino
```

---

## 7. Service Layer

### Pattern

Every service follows this pattern:

```typescript
import { eq, and, count, desc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { tableA, tableB } from '@eamaim/database/schema';

export class FooService {
  async findAll(tenantId: string, page = 1, limit = 20, filters?: Record<string, any>) {
    const offset = (page - 1) * limit;
    const conditions = [eq(tableA.tenantId, tenantId)];
    // Add dynamic filters...
    
    const [{ total }] = await db.select({ total: count() }).from(tableA).where(and(...conditions));
    const data = await db.select().from(tableA).where(and(...conditions))
      .orderBy(desc(tableA.createdAt)).limit(limit).offset(offset);

    return {
      data,
      pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) },
    };
  }

  async findById(id: string, tenantId: string) {
    const [row] = await db.select().from(tableA)
      .where(and(eq(tableA.id, id), eq(tableA.tenantId, tenantId)));
    return row || null;
  }

  async create(tenantId: string, data: NewFoo) {
    const [created] = await db.insert(tableA).values({ tenantId, ...data }).returning();
    return created;
  }
}

export const fooService = new FooService();
```

### Service Inventory (21 services)

| Service | File | Key Methods |
|---------|------|-------------|
| **AuthService** | `auth.service.ts` | `login()`, `refresh()`, `logout()`, `getCurrentUser()`, `loadUserPermissions()`, `hashPassword()` |
| **AssetService** | `asset.service.ts` | `findAll()`, `findById()`, `create()`, `update()`, `delete()`, `getHierarchy()` (recursive CTE), `getStatusSummary()`, `getCriticalitySummary()` |
| **MaintenanceService** | `maintenance.service.ts` | `findAllWorkOrders()`, `findWorkOrderById()`, `createWorkOrder()` (auto-number), `updateWorkOrderStatus()` (writes maintenance_history), `addTask()`, `addSparePart()`, `getPlans()`, `getWorkOrderDashboard()` |
| **InventoryService** | `inventory.service.ts` | `findAll()`, `findById()`, `create()`, `createTransaction()` (auto-qty update), `getStorerooms()`, `getBom()`, `getReorderAlerts()` |
| **ProcurementService** | `procurement.service.ts` | `getVendors()`, `createVendor()`, `getPurchaseOrders()`, `createPurchaseOrder()` (auto-number + line items), `createRequisition()`, `createGoodsReceipt()` |
| **DepreciationService** | `depreciation.service.ts` | `getProfiles()`, `createProfile()`, `getSchedule()`, `postCurrentPeriod()` (straight-line + declining balance → cost_transaction) |
| **CostRollupService** | `cost-rollup.service.ts` | `getCostRollup()`, `calculateRollup()` (SQL aggregation), `getTransactions()`, `getCostCenters()`, `getBudgets()`, `getReplacementAnalysis()` |
| **TelemetryService** | `telemetry.service.ts` | `getSensors()`, `createSensor()`, `getReadings()`, `getAggregatedReadings()` (TimescaleDB `time_bucket()`), `getActiveAlerts()`, `acknowledgeAlert()`, `getAlertRules()`, `createAlertRule()` |
| **RcmAnalysisService** | `rcm-analysis.service.ts` | `getFmea()`, `createFunction()`, `createFailureMode()`, `getFailureEvents()`, `getCriticality()`, `getReliability()`, `getRootCauseAnalyses()`, `getWeibullAnalyses()`, `getRam()` |
| **SafetyPermitService** | `safety-permit.service.ts` | `getPermits()`, `getPermitById()`, `createPermit()`, `updatePermitStatus()`, `getPermitTypes()`, `getLotoProcedures()`, `createObservation()`, `getObservations()` |
| **RegulatoryService** | `regulatory.service.ts` | `findAllRegulations()`, `getRequirements()`, `getInspections()`, `createInspection()`, `getViolations()`, `createViolation()`, `getCorrectiveActions()`, `createCorrectiveAction()`, `getAuditReports()`, `getComplianceDashboard()` |
| **CdeWorkflowService** | `cde-workflow.service.ts` | `getContainers()`, `getContainerById()`, `createContainer()`, `transitionState()` (ISO 19650 state machine), `getRevisions()`, `getHandoverPackages()` |
| **LaborService** | `labor.service.ts` | `findAllCrafts()`, `createCraft()`, `findAllCrews()`, `getCrewById()`, `createBooking()`, `getBookings()`, `getLaborRates()`, `getShifts()`, `getCertifications()` |
| **SlaService** | `sla.service.ts` | `findAll()`, `findById()`, `create()`, `getSummary()`, `getBreaches()` |
| **WarrantyService** | `warranty.service.ts` | `findAllTerms()`, `getCoverage()`, `createCoverage()`, `getClaims()`, `createClaim()` |
| **AirEnforcementService** | `air-enforcement.service.ts` | `getOirs()`, `getAirs()`, `createAir()`, `runComplianceCheck()`, `getComplianceChecks()`, `getIdps()`, `getLoin()` |
| **BimService** | `bim.service.ts` | `getModels()`, `getModelById()`, `getElements()`, `getAssetLinks()`, `linkElementToAsset()` |
| **TenantService** | `tenant.service.ts` | `findAll()`, `findById()`, `findBySlug()`, `create()`, `update()` |
| **HandoverService** | `handover.service.ts` | `getPackages()`, `getItems()` |
| **NotificationService** | `notification.service.ts` | Event bus for cross-module notifications |
| **DataQualityService** | `data-quality.service.ts` | `getRules()`, `getScores()` |

---

## 8. Background Workers

**File**: `apps/worker/src/index.ts`
**Technology**: BullMQ with Redis
**Concurrency**: 5 (configurable via `WORKER_CONCURRENCY`)

### Job Processors (15)

| Worker Name | Schedule | Logic |
|-------------|----------|-------|
| `maintenance-scheduler` | Daily 6 AM | Scans active `maintenance_plans`, generates WOs when `frequencyValue` days elapsed since last WO |
| `reliability-calculator` | Weekly Sun 2 AM | Calculates MTBF, MTTR, Availability per asset from 12-month WO history → inserts `reliability_metrics` |
| `sla-breach-check` | Every 15 min | Scans open WOs, compares elapsed time vs `sla_targets` per priority → inserts `sla_breaches` |
| `reorder-point-check` | Daily 9 AM | Joins `stock_levels` ↔ `reorder_rules`, auto-generates `purchase_requisitions` for items below reorder point |
| `depreciation-posting` | Monthly 1st 1 AM | Posts straight-line or declining-balance entries → `depreciation_schedule` + `cost_transactions` |
| `cost-rollup-calculation` | Monthly 1st 2 AM | Aggregates `cost_transactions` → `asset_cost_rollup` by category (labor, material, service, overhead, depreciation) |
| `weibull-recalculation` | Monthly 1st 4 AM | Re-fits Weibull β/η from `failure_events` using Method of Moments (requires ≥3 failures) |
| `permit-expiry-check` | Daily 8 AM | Auto-sets `work_permits.status = 'EXPIRED'` where `expiry_date < NOW()` |
| `warranty-expiry-check` | Daily 8 AM | Auto-expires `warranty_coverage` and alerts on 90-day window |
| `regulatory-deadline-check` | Daily 7 AM | Scans `compliance_requirements` for inspections due within 30 days |
| `air-compliance-check` | Monthly 1st 5 AM | Validates assets against `asset_info_requirements` |
| `data-quality-scan` | Weekly Sun 3 AM | Scores asset data completeness → `data_quality_scores` |
| `telemetry-aggregation` | — (event-driven) | Refreshes TimescaleDB `sensor_readings_hourly` continuous aggregate |
| `cde-notification` | — (event-driven) | Logs ISO 19650 state transitions for stakeholder notification |
| `ifc-parser` | — (event-driven) | Placeholder for web-ifc library integration |

---

## 9. Telemetry Ingestion

**File**: `apps/telemetry-ingestion/src/index.ts`
**Port**: 3002

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/ingest` | Single/few readings → buffer |
| `POST` | `/ingest/batch` | High-throughput batch → buffer |
| `POST` | `/events` | Alarm/state change → direct INSERT to `telemetry_events` |
| `POST` | `/flush` | Force buffer flush |
| `GET` | `/health` | Status + buffer size |
| `GET` | `/metrics` | Ingestion throughput metrics |

### Buffer Architecture

```
Readings → In-memory buffer → Batch INSERT (raw SQL) when:
  1. Buffer size ≥ BATCH_SIZE (default 1000)
  2. FLUSH_INTERVAL_MS timer fires (default 5000ms)
  3. /flush endpoint called
  4. SIGTERM/SIGINT graceful shutdown
```

### Reading Schema

```json
{ "sensorId": "uuid", "value": 72.5, "time": "ISO-8601", "tenantId": "uuid", "quality": "GOOD" }
```

---

## 10. Frontend Architecture

> **Status**: NOT YET BUILT — only `package.json`, `Dockerfile`, `tsconfig.json` exist.

### Planned Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3 |
| State | Zustand (global) + TanStack React Query v5 (server) |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |

### Page Map (14 modules, ~50 pages)

| Module | Route | Backend Prefix |
|--------|-------|----------------|
| Auth | `/login` | `/api/v1/auth` |
| Dashboard | `/` | `/api/v1/reports/*` |
| Assets | `/assets`, `/assets/[id]` | `/api/v1/assets` |
| Maintenance | `/maintenance/*` | `/api/v1/maintenance` |
| Inventory | `/inventory/*` | `/api/v1/inventory` |
| Procurement | `/procurement/*` | `/api/v1/procurement` |
| Financials | `/financials/*` | `/api/v1/financials` |
| Telemetry | `/telemetry/*` | `/api/v1/telemetry` |
| RCM | `/rcm/*` | `/api/v1/rcm` |
| Safety | `/safety/*` | `/api/v1/safety` |
| Regulatory | `/regulatory/*` | `/api/v1/regulatory` |
| Labor/CDE/SR | `/labor/*`, `/cde/*`, `/service-requests/*` | respective APIs |
| Projects/SLA/Warranty/BIM | `/projects/*`, `/sla/*`, `/warranty/*`, `/bim/*` | respective APIs |
| Settings | `/settings/*` | `/api/v1/tenants` |

### API Client Pattern

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const tenantId = useAuthStore.getState().tenantId;
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      ...options?.headers,
    },
  });
  
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}
```

---

## 11. Infrastructure & Deployment

### Docker Compose Services (7)

| Service | Image | Port | Purpose |
|---------|-------|:----:|---------|
| `postgres` | PostgreSQL 16 + TimescaleDB | 5432 | Primary database |
| `redis` | Redis 7 Alpine | 6379 | Cache, sessions, BullMQ |
| `api` | Custom (Fastify) | 3001 | REST API |
| `worker` | Custom (BullMQ) | — | Background jobs |
| `web` | Custom (Next.js) | 3000 | Frontend |
| `telemetry-ingestion` | Custom (Fastify) | 3002 | Sensor data |
| `mosquitto` | Eclipse Mosquitto 2 | 1883/9001 | MQTT broker |
| `pgadmin` | dpage/pgadmin4 | 5050 | Dev-only DB admin |

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://eam_user:eam_secret@postgres:5432/eam_platform
POSTGRES_USER=eam_user
POSTGRES_PASSWORD=eam_secret
POSTGRES_DB=eam_platform

# Redis
REDIS_URL=redis://redis:6379

# API
PORT=3001
JWT_SECRET=change-me-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
NODE_ENV=development

# Worker
WORKER_CONCURRENCY=5

# Telemetry
TELEMETRY_BATCH_SIZE=1000
TELEMETRY_FLUSH_INTERVAL=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### CI/CD Pipelines (GitHub Actions)

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | Push/PR to main/develop | pnpm install → lint → typecheck → test → build |
| `cd-staging.yml` | Push to develop | Build Docker images → push to GHCR → deploy staging |
| `cd-production.yml` | Push to main / tag `v*.*.*` | Validate → build → push to GHCR → deploy production |

### Quick Start Commands

```bash
# Full stack start
docker compose up -d

# Run migrations
pnpm --filter @eamaim/database migrate:run

# Seed demo data
pnpm --filter @eamaim/database seed

# Start individual services (dev mode)
pnpm --filter @eamaim/api dev          # API on :3001
pnpm --filter @eamaim/worker dev       # BullMQ workers
pnpm --filter @eamaim/telemetry-ingestion dev  # Telemetry on :3002
pnpm --filter @platform/web dev        # Frontend on :3000

# Run tests
pnpm --filter @eamaim/api test

# Monorepo-wide
pnpm dev          # All apps via Turbo
pnpm build        # Build all
pnpm test         # Test all
pnpm typecheck    # Type check all
```

---

## 12. Authentication & Authorization

### Login Flow

```
1. Client sends POST /api/v1/auth/login { email, password }
2. AuthService looks up user by email (must be isActive=true)
3. bcrypt.compare(password, user.passwordHash) — 12 salt rounds
4. Update lastLoginAt on user record
5. Load permissions: role_assignments → roles.permissions (merged + deduplicated)
6. Create session: generate token (32 bytes hex) + refreshToken
7. Return { user: { id, email, name, role, tenantId, permissions }, token, refreshToken, expiresAt }
```

### JWT Payload

```json
{
  "sub": "user-uuid",
  "tenantId": "tenant-uuid",
  "role": "admin",
  "iat": 1720000000,
  "exp": 1720086400
}
```

### Token Refresh

```
POST /api/v1/auth/refresh { refreshToken }
→ Validate session exists and not expired
→ Generate new token + refreshToken pair
→ Return new tokens
```

### Permission Resolution

```
user → role_assignments (JOIN) → roles.permissions (jsonb)
→ Flatten all role permissions into Set<string>
→ Handle array format: ["ASSET_CREATE", "ASSET_READ"]
→ Handle object format: { assets: ["create", "read", "*"] } → "ASSETS_CREATE", "ASSETS:*"
```

### Seed Users & Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@acme-industrial.com` | `admin123` | Administrator (full access) |
| `john.planner@acme-industrial.com` | `admin123` | Maintenance Planner |
| `mike.tech@acme-industrial.com` | `admin123` | Maintenance Technician |
| `emma.tech@acme-industrial.com` | `admin123` | Maintenance Technician |
| `raj.reliability@acme-industrial.com` | `admin123` | Reliability Engineer |
| `lisa.safety@acme-industrial.com` | `admin123` | Safety Officer |

---

## 13. Data Patterns & Conventions

### Multi-Tenancy

Every table has `tenantId` (UUID, NOT NULL, FK → tenants). All queries **MUST** filter by `tenantId`.

```typescript
// ✅ Correct
db.select().from(assets).where(and(eq(assets.tenantId, tenantId), ...))

// ❌ Wrong — data leak
db.select().from(assets).where(eq(assets.status, 'ACTIVE'))
```

### ID Generation

All primary keys use `uuid('id').primaryKey().defaultRandom()` — PostgreSQL `gen_random_uuid()`.

### Auto-Numbering

WO, PO, PR, SR numbers are auto-generated:
```typescript
const [{ total }] = await db.select({ total: count() }).from(workOrders).where(eq(workOrders.tenantId, tenantId));
const woNumber = `WO-${String(Number(total) + 1).padStart(6, '0')}`;
```

### Pagination

All list endpoints return:
```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 156, "totalPages": 8 }
}
```

Query params: `?page=1&limit=20`

### Soft Deletes

Assets use status-based soft delete (status → `DISPOSED`), not physical deletion.

### Timestamps

All tables include:
- `createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()`
- `updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()`

### JSON Metadata

Many tables include `metadata: jsonb('metadata')` for extensible attributes without schema migration.

---

## 14. Testing Strategy

### Framework

- **Vitest** 3.x with `globals: true`
- Config: `apps/api/vitest.config.ts`
- Run: `pnpm --filter @eamaim/api test`

### Test Files (6)

| File | Covers | Test Count |
|------|--------|:----------:|
| `server.test.ts` | Health check, DB connectivity, CORS | 3 |
| `assets.routes.test.ts` | Pagination, 404, search, summaries, CRUD | 6 |
| `auth.routes.test.ts` | Login validation, JWT, refresh, logout, /me | 5 |
| `maintenance.routes.test.ts` | WO CRUD, status, plans, dashboard | 7 |
| `inventory.routes.test.ts` | Stock items, storerooms, reorder alerts | 4 |
| `domain-routes.test.ts` | Telemetry, RCM, Safety, Regulatory | 10+ |

### Test Pattern

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';

describe('Module Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.decorateRequest('tenantId', 'test-tenant-id');
    await server.register(jwt, { secret: 'test-secret' });
    server.addHook('onRequest', async (req) => { req.tenantId = 'test-tenant-id'; });
    await server.register(moduleRoutes, { prefix: '/api/v1/module' });
    await server.ready();
  });

  afterAll(() => server.close());

  it('GET /endpoint should return data', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/module/endpoint' });
    expect(res.statusCode).toBe(200);
  });
});
```

---

## 15. Extension Guide

### Adding a New Module

1. **Schema**: Create `packages/database/src/schema/<module>/` with table files
2. **Export**: Add to `packages/database/src/schema/index.ts`
3. **Service**: Create `apps/api/src/services/<module>.service.ts`
4. **Routes**: Create `apps/api/src/routes/<module>.routes.ts`
5. **Register**: Import and register in `apps/api/src/index.ts`
6. **Tests**: Create `apps/api/src/routes/<module>.routes.test.ts`
7. **Seed**: Add demo data to `packages/database/src/seed.ts`
8. **Worker**: Add background job if needed in `apps/worker/src/index.ts`

### Adding a New Endpoint to Existing Module

1. Add route handler in `routes/<module>.routes.ts`
2. Add service method in `services/<module>.service.ts`
3. Add test case in `routes/<module>.routes.test.ts`

### Database Migration

```bash
# After modifying schema files:
pnpm --filter @eamaim/database generate    # Generate SQL migration
pnpm --filter @eamaim/database migrate:run  # Apply migration
```

### Key Import Paths

```typescript
// Database client
import { db, setTenantContext, checkDatabaseHealth, closeDatabaseConnection } from '@eamaim/database';

// Schema tables (all exported from barrel)
import { assets, workOrders, users, tenants, ... } from '@eamaim/database/schema';

// ORM utilities
import { eq, and, or, sql, count, desc, asc, like, gte, lte, inArray } from 'drizzle-orm';
```

---

> **Document End** — This document covers the complete system. Any AI coding agent can use it as reference to implement, debug, or extend any part of the platform.
