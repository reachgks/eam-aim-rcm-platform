import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { tenants } from '@eamaim/database/schema';

export class TenantService {
  async findAll() {
    return db.select().from(tenants).where(eq(tenants.isActive, true)).orderBy(asc(tenants.name));
  }

  async findById(id: string) {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    return tenant || null;
  }

  async findBySlug(slug: string) {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
    return tenant || null;
  }

  async create(data: any) {
    const [tenant] = await db.insert(tenants).values(data).returning();
    return tenant;
  }

  async update(id: string, data: any) {
    const [updated] = await db.update(tenants).set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id)).returning();
    return updated || null;
  }
}

export const tenantService = new TenantService();
