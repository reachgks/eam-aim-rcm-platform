import { pgTable, uuid, varchar, text, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { crafts } from './crafts';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const certificationStatusEnum = pgEnum('certification_status', [
  'ACTIVE',
  'EXPIRED',
  'SUSPENDED',
  'REVOKED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const craftCertifications = pgTable(
  'craft_certifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    craftId: uuid('craft_id')
      .notNull()
      .references(() => crafts.id),
    certificationName: varchar('certification_name', { length: 200 }).notNull(),
    certifyingBody: varchar('certifying_body', { length: 200 }),
    certificateNumber: varchar('certificate_number', { length: 100 }),
    issuedDate: date('issued_date').notNull(),
    expiryDate: date('expiry_date'),
    status: certificationStatusEnum('status').notNull().default('ACTIVE'),
    documentId: uuid('document_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_craft_certs_tenant_user').on(table.tenantId, table.userId),
    index('idx_craft_certs_tenant_craft').on(table.tenantId, table.craftId),
    index('idx_craft_certs_status').on(table.tenantId, table.status),
    index('idx_craft_certs_expiry').on(table.tenantId, table.expiryDate),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const craftCertificationsRelations = relations(craftCertifications, ({ one }) => ({
  craft: one(crafts, {
    fields: [craftCertifications.craftId],
    references: [crafts.id],
  }),
}));
