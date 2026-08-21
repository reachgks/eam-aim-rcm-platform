import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { assets } from './assets';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const assetApprovalStatusEnum = pgEnum('asset_approval_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const assetApprovals = pgTable(
  'asset_approvals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    approvalStep: integer('approval_step').notNull(),
    approverRole: varchar('approver_role', { length: 100 }).notNull(),
    approverId: uuid('approver_id'),
    status: assetApprovalStatusEnum('status').notNull().default('PENDING'),
    comments: text('comments'),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_asset_approvals_tenant_asset').on(table.tenantId, table.assetId),
    index('idx_asset_approvals_approver').on(table.tenantId, table.approverId),
    index('idx_asset_approvals_status').on(table.tenantId, table.status),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const assetApprovalsRelations = relations(assetApprovals, ({ one }) => ({
  asset: one(assets, {
    fields: [assetApprovals.assetId],
    references: [assets.id],
  }),
}));

// ─── Types ────────────────────────────────────────────────────────────────────
export type AssetApproval = typeof assetApprovals.$inferSelect;
export type NewAssetApproval = typeof assetApprovals.$inferInsert;
