// ══════════════════════════════════════════════
// EAM/AIM/RCM Platform — Schema Index
// 22 modules, ~131 tables + 3 analytical views
// ══════════════════════════════════════════════

// ── Core Foundation ──
export * from './core/tenants';
export * from './core/users';
export * from './core/roles-permissions';
export * from './core/audit-log';

// ── Authentication ──
export * from './auth/sessions';
export * from './auth/sso-providers';
export * from './auth/api-keys';
export * from './auth/mfa-tokens';

// ── Asset Register ──
export * from './asset-register/assets';
export * from './asset-register/asset-types';
export * from './asset-register/asset-hierarchy';
export * from './asset-register/functional-locations';
export * from './asset-register/asset-attributes';
export * from './asset-register/asset-lifecycle';
export * from './asset-register/asset-classification';

// ── Common Data Environment (CDE) ──
export * from './cde/information-containers';
export * from './cde/cde-states';
export * from './cde/cde-workflows';
export * from './cde/document-registry';
export * from './cde/revision-history';
export * from './cde/handover-management';
export * from './cde/data-quality';
export * from './cde/data-dictionary';
export * from './cde/digital-twin';

// ── OIR & AIR Enforcement ──
export * from './oir-air/organizational-info-requirements';
export * from './oir-air/asset-info-requirements';
export * from './oir-air/exchange-info-requirements';
export * from './oir-air/air-compliance-checks';
export * from './oir-air/information-delivery-plans';
export * from './oir-air/loin-definitions';

// ── Maintenance ──
export * from './maintenance/work-orders';
export * from './maintenance/work-order-approvals';
export * from './maintenance/maintenance-plans';
export * from './maintenance/maintenance-tasks';
export * from './maintenance/spare-parts';
export * from './maintenance/maintenance-history';
export * from './maintenance/maintenance-routes';
export * from './maintenance/route-stops';
export * from './maintenance/route-executions';
export * from './maintenance/shutdown-events';
export * from './maintenance/shutdown-scope-items';

// ── Labor & Workforce ──
export * from './labor/crafts';
export * from './labor/craft-certifications';
export * from './labor/crews';
export * from './labor/crew-members';
export * from './labor/shifts';
export * from './labor/labor-rates';
export * from './labor/labor-bookings';
export * from './labor/labor-availability';

// ── Inventory & Warehouse ──
export * from './inventory/storerooms';
export * from './inventory/stock-items';
export * from './inventory/stock-levels';
export * from './inventory/stock-transactions';
export * from './inventory/bill-of-materials';
export * from './inventory/cycle-counts';
export * from './inventory/reorder-rules';

// ── Procurement ──
export * from './procurement/vendors';
export * from './procurement/vendor-ratings';
export * from './procurement/purchase-requisitions';
export * from './procurement/purchase-orders';
export * from './procurement/po-line-items';
export * from './procurement/goods-receipts';
export * from './procurement/invoice-matching';

// ── Warranty ──
export * from './warranty/warranty-terms';
export * from './warranty/warranty-coverage';
export * from './warranty/warranty-claims';

// ── SLA Management ──
export * from './sla/sla-definitions';
export * from './sla/sla-targets';
export * from './sla/sla-tracking';
export * from './sla/sla-breaches';

// ── Contractors ──
export * from './contractors/contractors';
export * from './contractors/contracts';
export * from './contractors/contract-line-items';
export * from './contractors/contractor-personnel';
export * from './contractors/contractor-safety';

// ── Safety & Permits ──
export * from './safety/work-permits';
export * from './safety/permit-types';
export * from './safety/isolation-points';
export * from './safety/loto-procedures';
export * from './safety/safety-observations';

// ── Financials (v3.1: Depreciation, Cost Rollup, Replacement Analysis) ──
export * from './financials/cost-centers';
export * from './financials/budgets';
export * from './financials/budget-line-items';
export * from './financials/cost-transactions';
export * from './financials/depreciation-profiles';
export * from './financials/depreciation-schedule';
export * from './financials/asset-valuations';
export * from './financials/asset-cost-rollup';
export * from './financials/replacement-analysis';

// ── Capital Projects & MOC ──
export * from './projects/capital-projects';
export * from './projects/project-phases';
export * from './projects/project-tasks';
export * from './projects/management-of-change';
export * from './projects/moc-approvals';

// ── Service Requests ──
export * from './service-requests/service-requests';
export * from './service-requests/request-categories';
export * from './service-requests/request-comments';

// ── RCM: Reliability ──
export * from './rcm/functions';
export * from './rcm/functional-failures';
export * from './rcm/failure-modes';
export * from './rcm/fmea-analysis';
export * from './rcm/failure-events';
export * from './rcm/rcm-decisions';
export * from './rcm/criticality-analysis';
export * from './rcm/reliability-metrics';
export * from './rcm/root-cause-analysis';
export * from './rcm/rca-contributing-factors';
export * from './rcm/pf-curves';
export * from './rcm/weibull-analysis';
export * from './rcm/ram-analysis';
export * from './rcm/task-packages';

// ── Classification & Taxonomy ──
export * from './classification/uniclass-codes';
export * from './classification/iso14224-taxonomy';
export * from './classification/failure-code-library';
export * from './classification/cause-code-library';

// ── Telemetry / IoT ──
export * from './telemetry/sensor-registry';
export * from './telemetry/sensor-readings';
export * from './telemetry/telemetry-events';
export * from './telemetry/data-points';
export * from './telemetry/alert-rules';
export * from './telemetry/alert-history';
export * from './telemetry/continuous-aggregates';

// ── BIM / IFC ──
export * from './bim/ifc-models';
export * from './bim/ifc-elements';
export * from './bim/element-asset-links';
export * from './bim/model-versions';

// ── Regulatory Compliance ──
export * from './regulatory/regulations';
export * from './regulatory/compliance-requirements';
export * from './regulatory/requirement-asset-map';
export * from './regulatory/inspections';
export * from './regulatory/violations';
export * from './regulatory/corrective-actions';
export * from './regulatory/audit-reports';

// ── Performance & KPIs ──
export * from './performance/condition-assessments';
export * from './performance/meter-readings';
export * from './performance/kpi-definitions';
export * from './performance/kpi-results';
