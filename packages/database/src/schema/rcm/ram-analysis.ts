import { pgTable, uuid, varchar, integer, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const ramTypeEnum = pgEnum('ram_analysis_type', ['SERIES', 'PARALLEL', 'COMPLEX', 'MONTE_CARLO']);
export const redundancyEnum = pgEnum('redundancy_type', ['NONE', 'ACTIVE', 'STANDBY', 'N_PLUS_1']);
export const systemPositionEnum = pgEnum('system_position', ['SERIES', 'PARALLEL']);

export const ramAnalyses = pgTable('ram_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  systemAssetId: uuid('system_asset_id').notNull().references(() => assets.id),
  analysisName: varchar('analysis_name', { length: 200 }).notNull(),
  analysisType: ramTypeEnum('analysis_type').notNull(),
  systemReliability: decimal('system_reliability', { precision: 6, scale: 4 }),
  systemAvailability: decimal('system_availability', { precision: 6, scale: 4 }),
  systemMaintainability: decimal('system_maintainability', { precision: 6, scale: 4 }),
  missionTimeHours: decimal('mission_time_hours', { precision: 10, scale: 2 }),
  inherentAvailability: decimal('inherent_availability', { precision: 6, scale: 4 }),
  operationalAvailability: decimal('operational_availability', { precision: 6, scale: 4 }),
  targetAvailability: decimal('target_availability', { precision: 6, scale: 4 }),
  meetsTarget: boolean('meets_target'),
  bottleneckAssetId: uuid('bottleneck_asset_id').references(() => assets.id),
  simulationRuns: integer('simulation_runs'),
  analysisDate: timestamp('analysis_date', { withTimezone: true }).defaultNow(),
  performedBy: uuid('performed_by').references(() => users.id),
  documentId: uuid('document_id'),
});

export const ramComponentData = pgTable('ram_component_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  ramAnalysisId: uuid('ram_analysis_id').notNull().references(() => ramAnalyses.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  mtbfHours: decimal('mtbf_hours', { precision: 12, scale: 2 }),
  mttrHours: decimal('mttr_hours', { precision: 12, scale: 2 }),
  failureRate: decimal('failure_rate', { precision: 15, scale: 8 }),
  repairRate: decimal('repair_rate', { precision: 15, scale: 8 }),
  redundancy: redundancyEnum('redundancy').default('NONE'),
  positionInSystem: systemPositionEnum('position_in_system').notNull(),
});

export type RamAnalysis = typeof ramAnalyses.$inferSelect;
export type RamComponentData = typeof ramComponentData.$inferSelect;
