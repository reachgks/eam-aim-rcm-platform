import { pgTable, uuid, integer, text, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { maintenanceRoutes } from './maintenance-routes';

// ─── Table ────────────────────────────────────────────────────────────────────

export const routeStops = pgTable(
  'route_stops',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    routeId: uuid('route_id')
      .notNull()
      .references(() => maintenanceRoutes.id),
    assetId: uuid('asset_id').notNull(),
    stopSequence: integer('stop_sequence').notNull(),
    inspectionChecklist: jsonb('inspection_checklist'),
    estimatedMinutes: integer('estimated_minutes'),
    instructions: text('instructions'),
  },
  (table) => [
    index('idx_route_stops_route').on(table.routeId, table.stopSequence),
    index('idx_route_stops_tenant').on(table.tenantId, table.routeId),
    index('idx_route_stops_asset').on(table.tenantId, table.assetId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const routeStopsRelations = relations(routeStops, ({ one }) => ({
  route: one(maintenanceRoutes, {
    fields: [routeStops.routeId],
    references: [maintenanceRoutes.id],
  }),
}));
