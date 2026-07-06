import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  informationContainers, cdeStates, cdeWorkflowTransitions,
  cdeWorkflowDefinitions, documentRegistry, revisionHistory,
  handoverPackages, handoverItems, dataQualityRules, dataQualityScores,
} from '@eamaim/database/schema';

export class CdeWorkflowService {
  async findAllContainers(tenantId: string, options: { page?: number; limit?: number; status?: string } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(informationContainers.tenantId, tenantId)];
    if (options.status) conditions.push(eq(informationContainers.status, options.status));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(informationContainers).where(where).orderBy(desc(informationContainers.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(informationContainers).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async findContainerById(tenantId: string, id: string) {
    const [container] = await db.select().from(informationContainers)
      .where(and(eq(informationContainers.id, id), eq(informationContainers.tenantId, tenantId))).limit(1);
    if (!container) return null;
    const [states, revisions] = await Promise.all([
      db.select().from(cdeStates).where(eq(cdeStates.containerId, id)).orderBy(desc(cdeStates.changedAt)),
      db.select().from(revisionHistory).where(eq(revisionHistory.containerId, id)).orderBy(desc(revisionHistory.revisionNumber)),
    ]);
    return { ...container, stateHistory: states, revisions };
  }

  async createContainer(tenantId: string, data: any) {
    const [container] = await db.insert(informationContainers).values({ ...data, tenantId }).returning();
    // Create initial CDE state
    await db.insert(cdeStates).values({
      tenantId, containerId: container.id, state: 'WORK_IN_PROGRESS', changedBy: data.createdBy,
    });
    return container;
  }

  async transitionState(tenantId: string, containerId: string, toState: string, userId: string, notes?: string) {
    // Get current state
    const [current] = await db.select().from(cdeStates)
      .where(and(eq(cdeStates.containerId, containerId), eq(cdeStates.tenantId, tenantId)))
      .orderBy(desc(cdeStates.changedAt)).limit(1);

    // Record new state
    const [newState] = await db.insert(cdeStates).values({
      tenantId, containerId, state: toState as any,
      previousState: current?.state, changedBy: userId,
    }).returning();

    // Update container status
    await db.update(informationContainers).set({ status: toState })
      .where(eq(informationContainers.id, containerId));

    return newState;
  }

  async getHandoverPackages(tenantId: string) {
    return db.select().from(handoverPackages).where(eq(handoverPackages.tenantId, tenantId));
  }

  async getDocumentRegistry(tenantId: string, options: { assetId?: string } = {}) {
    const conditions = [eq(documentRegistry.tenantId, tenantId)];
    if (options.assetId) conditions.push(eq(documentRegistry.assetId, options.assetId));
    return db.select().from(documentRegistry).where(and(...conditions));
  }
}

export const cdeWorkflowService = new CdeWorkflowService();
