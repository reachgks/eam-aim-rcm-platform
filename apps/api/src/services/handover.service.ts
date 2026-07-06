import { eq, and, desc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { handoverPackages, handoverItems } from '@eamaim/database/schema';

export class HandoverService {
  async findAll(tenantId: string) {
    return db.select().from(handoverPackages).where(eq(handoverPackages.tenantId, tenantId)).orderBy(desc(handoverPackages.createdAt));
  }

  async findById(tenantId: string, id: string) {
    const [pkg] = await db.select().from(handoverPackages).where(and(eq(handoverPackages.id, id), eq(handoverPackages.tenantId, tenantId))).limit(1);
    if (!pkg) return null;
    const items = await db.select().from(handoverItems).where(eq(handoverItems.packageId, id));
    return { ...pkg, items };
  }

  async create(tenantId: string, data: any) {
    const [pkg] = await db.insert(handoverPackages).values({ ...data, tenantId }).returning();
    return pkg;
  }

  async addItem(tenantId: string, packageId: string, data: any) {
    const [item] = await db.insert(handoverItems).values({ ...data, tenantId, packageId }).returning();
    return item;
  }
}

export const handoverService = new HandoverService();
