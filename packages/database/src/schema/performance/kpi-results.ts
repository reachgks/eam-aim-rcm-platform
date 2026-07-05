import { pgTable, uuid, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { kpiDefinitions } from './kpi-definitions';
import { assets } from '../asset-register/assets';

export const kpiStatusEnum = pgEnum('kpi_status', ['ON_TARGET', 'WARNING', 'CRITICAL']);
export const kpiTrendEnum = pgEnum('kpi_trend', ['IMPROVING', 'STABLE', 'DECLINING']);

export const kpiResults = pgTable('kpi_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  kpiId: uuid('kpi_id').notNull().references(() => kpiDefinitions.id),
  assetId: uuid('asset_id').references(() => assets.id),
  siteId: uuid('site_id'),
  calculationDate: timestamp('calculation_date', { withTimezone: true }).defaultNow(),
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  value: decimal('value', { precision: 15, scale: 4 }).notNull(),
  targetValue: decimal('target_value', { precision: 15, scale: 4 }),
  status: kpiStatusEnum('kpi_status'),
  trend: kpiTrendEnum('kpi_trend'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type KpiResult = typeof kpiResults.$inferSelect;
