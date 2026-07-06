import { eq, and, desc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { ifcModels, ifcElements, elementAssetLinks, modelVersions } from '@eamaim/database/schema';

export class BimService {
  async findAllModels(tenantId: string) {
    return db.select().from(ifcModels).where(eq(ifcModels.tenantId, tenantId)).orderBy(desc(ifcModels.createdAt));
  }

  async findModelById(tenantId: string, id: string) {
    const [model] = await db.select().from(ifcModels).where(and(eq(ifcModels.id, id), eq(ifcModels.tenantId, tenantId))).limit(1);
    if (!model) return null;
    const [elements, versions] = await Promise.all([
      db.select().from(ifcElements).where(eq(ifcElements.modelId, id)).limit(100),
      db.select().from(modelVersions).where(eq(modelVersions.modelId, id)).orderBy(desc(modelVersions.versionNumber)),
    ]);
    return { ...model, elements, versions };
  }

  async createModel(tenantId: string, data: any) {
    const [model] = await db.insert(ifcModels).values({ ...data, tenantId }).returning();
    return model;
  }

  async linkElementToAsset(tenantId: string, data: any) {
    const [link] = await db.insert(elementAssetLinks).values({ ...data, tenantId }).returning();
    return link;
  }

  async getAssetLinks(tenantId: string, assetId: string) {
    return db.select().from(elementAssetLinks)
      .where(and(eq(elementAssetLinks.tenantId, tenantId), eq(elementAssetLinks.assetId, assetId)));
  }
}

export const bimService = new BimService();
