# ISO 55000 — Asset Management System Mapping

## Overview

ISO 55000 series provides requirements and guidance for establishing, implementing, maintaining, and improving an asset management system. This platform implements the key requirements across its 22 modules.

## Clause Mapping

| ISO 55001 Clause | Platform Module | Implementation |
|-----------------|-----------------|----------------|
| 4.1 Understanding the Organization | `core/tenants` | Multi-tenant context, organizational hierarchy |
| 4.2 Stakeholder Needs | `oir-air` | OIR/AIR/EIR requirements management |
| 5.1 Leadership | `core/roles-permissions` | RBAC, approval workflows |
| 6.1 Risk Management | `rcm/criticality-analysis`, `rcm/fmea-analysis` | Risk-based maintenance strategy |
| 6.2 Asset Management Objectives | `performance/kpi-definitions` | KPI targets and tracking |
| 7.1 Resources | `labor/`, `inventory/` | Workforce and material management |
| 7.5 Information Requirements | `oir-air/`, `cde/` | ISO 19650-aligned information management |
| 8.1 Operational Planning | `maintenance/maintenance-plans` | Preventive/predictive maintenance |
| 8.2 Management of Change | `projects/management-of-change` | Controlled asset modifications |
| 9.1 Performance Evaluation | `performance/kpi-results` | Automated KPI calculation |
| 9.2 Internal Audit | `regulatory/audit-reports` | Audit tracking and findings |
| 10.1 Nonconformity & Corrective Action | `regulatory/corrective-actions` | CAPA management |
| 10.2 Preventive Action | `rcm/rcm-decisions` | RCM-driven preventive tasks |

## Asset Lifecycle Coverage

```
PLAN → ACQUIRE → COMMISSION → OPERATE → MAINTAIN → DECOMMISSION → DISPOSE
  │        │          │          │          │            │            │
  ▼        ▼          ▼          ▼          ▼            ▼            ▼
projects  asset     asset      telemetry  maintenance  asset        asset
          register  lifecycle   KPIs      work-orders  lifecycle    lifecycle
          financials                      RCM          financials   financials
```
