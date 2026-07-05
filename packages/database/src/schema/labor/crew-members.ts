import { pgTable, uuid, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { crews } from './crews';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const crewMemberRoleEnum = pgEnum('crew_member_role', [
  'LEADER',
  'MEMBER',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const crewMembers = pgTable(
  'crew_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    crewId: uuid('crew_id')
      .notNull()
      .references(() => crews.id),
    userId: uuid('user_id').notNull(),
    role: crewMemberRoleEnum('role').notNull().default('MEMBER'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    leftAt: timestamp('left_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_crew_members_crew').on(table.crewId),
    index('idx_crew_members_user').on(table.userId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const crewMembersRelations = relations(crewMembers, ({ one }) => ({
  crew: one(crews, {
    fields: [crewMembers.crewId],
    references: [crews.id],
  }),
}));
