import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  workOrders, type WorkOrder,
  maintenanceTasks,
  maintenancePlans,
  maintenanceHistory,
  sparePartsUsage,
  workOrderApprovals,
} from '@eamaim/database/schema';

export class MaintenanceService {
  // ── List Work Orders ──
  async findAllWorkOrders(tenantId: string, options: {
    page?: number; limit?: number; status?: string; type?: string;
    priority?: string; assetId?: string; assignedTo?: string;
    sortBy?: string; sortOrder?: 'asc' | 'desc';
  } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const offset = (page - 1) * limit;

    const conditions = [eq(workOrders.tenantId, tenantId)];

    if (options.status) conditions.push(eq(workOrders.status, options.status as any));
    if (options.type) conditions.push(eq(workOrders.type, options.type as any));
    if (options.priority) conditions.push(eq(workOrders.priority, options.priority as any));
    if (options.assetId) conditions.push(eq(workOrders.assetId, options.assetId));
    if (options.assignedTo) conditions.push(eq(workOrders.assignedTo, options.assignedTo));

    const where = and(...conditions);

    const sortColumn = options.sortBy === 'priority' ? workOrders.priority
      : options.sortBy === 'scheduledStart' ? workOrders.scheduledStart
      : workOrders.createdAt;

    const [data, [{ total }]] = await Promise.all([
      db.select()
        .from(workOrders)
        .where(where)
        .orderBy(options.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn))
        .limit(limit)
        .offset(offset),

      db.select({ total: count() }).from(workOrders).where(where),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) },
    };
  }

  // ── Get Work Order with Tasks & Parts ──
  async findWorkOrderById(tenantId: string, id: string) {
    const [wo] = await db.select()
      .from(workOrders)
      .where(and(eq(workOrders.id, id), eq(workOrders.tenantId, tenantId)))
      .limit(1);

    if (!wo) return null;

    const [tasks, parts, approvals] = await Promise.all([
      db.select().from(maintenanceTasks)
        .where(and(eq(maintenanceTasks.workOrderId, id), eq(maintenanceTasks.tenantId, tenantId)))
        .orderBy(asc(maintenanceTasks.sequence)),

      db.select().from(sparePartsUsage)
        .where(and(eq(sparePartsUsage.workOrderId, id), eq(sparePartsUsage.tenantId, tenantId))),

      db.select().from(workOrderApprovals)
        .where(and(eq(workOrderApprovals.workOrderId, id), eq(workOrderApprovals.tenantId, tenantId)))
        .orderBy(asc(workOrderApprovals.approvalStep)),
    ]);

    return { ...wo, tasks, spareParts: parts, approvals };
  }

  // ── Create Work Order ──
  async createWorkOrder(tenantId: string, data: any) {
    // Auto-generate WO number
    const [{ total }] = await db.select({ total: count() })
      .from(workOrders)
      .where(eq(workOrders.tenantId, tenantId));
    const woNumber = `WO-${String(Number(total) + 1).padStart(6, '0')}`;

    const [wo] = await db.insert(workOrders)
      .values({ ...data, tenantId, woNumber, status: data.status || 'DRAFT' })
      .returning();
    return wo;
  }

  // ── Update Work Order ──
  async updateWorkOrder(tenantId: string, id: string, data: any) {
    const [updated] = await db.update(workOrders)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(workOrders.id, id), eq(workOrders.tenantId, tenantId)))
      .returning();
    return updated || null;
  }

  // ── Change Work Order Status ──
  async changeStatus(tenantId: string, id: string, newStatus: string, userId?: string) {
    const now = new Date();
    const updateData: any = { status: newStatus, updatedAt: now };

    if (newStatus === 'IN_PROGRESS' && !updateData.actualStart) updateData.actualStart = now;
    if (newStatus === 'COMPLETED') updateData.actualEnd = now;

    const [wo] = await db.update(workOrders)
      .set(updateData)
      .where(and(eq(workOrders.id, id), eq(workOrders.tenantId, tenantId)))
      .returning();

    // Record in maintenance history if completed
    if (newStatus === 'COMPLETED' && wo) {
      await db.insert(maintenanceHistory).values({
        tenantId,
        assetId: wo.assetId,
        workOrderId: wo.id,
        eventType: wo.type,
        completionDate: now,
        summary: wo.description,
        laborHours: wo.actualHours?.toString(),
        laborCost: wo.actualCost?.toString(),
        totalCost: wo.actualCost?.toString(),
        isPlanned: wo.type === 'PREVENTIVE' || wo.type === 'PREDICTIVE',
      });
    }
    return wo || null;
  }

  // ── Add Task to Work Order ──
  async addTask(tenantId: string, workOrderId: string, data: any) {
    const [task] = await db.insert(maintenanceTasks)
      .values({ ...data, tenantId, workOrderId })
      .returning();
    return task;
  }

  // ── Record Spare Part Usage ──
  async recordSparePartUsage(tenantId: string, workOrderId: string, data: any) {
    const [usage] = await db.insert(sparePartsUsage)
      .values({ ...data, tenantId, workOrderId })
      .returning();
    return usage;
  }

  // ── List Maintenance Plans ──
  async findAllPlans(tenantId: string) {
    return db.select()
      .from(maintenancePlans)
      .where(eq(maintenancePlans.tenantId, tenantId))
      .orderBy(asc(maintenancePlans.planCode));
  }

  // ── Create Maintenance Plan ──
  async createPlan(tenantId: string, data: any) {
    const [plan] = await db.insert(maintenancePlans)
      .values({ ...data, tenantId })
      .returning();
    return plan;
  }

  // ── Work Order Summary Dashboard ──
  async getWoSummary(tenantId: string) {
    const [statusCounts, typeCounts, priorityCounts] = await Promise.all([
      db.select({ status: workOrders.status, count: count() })
        .from(workOrders).where(eq(workOrders.tenantId, tenantId))
        .groupBy(workOrders.status),

      db.select({ type: workOrders.type, count: count() })
        .from(workOrders).where(eq(workOrders.tenantId, tenantId))
        .groupBy(workOrders.type),

      db.select({ priority: workOrders.priority, count: count() })
        .from(workOrders).where(eq(workOrders.tenantId, tenantId))
        .groupBy(workOrders.priority),
    ]);

    return { byStatus: statusCounts, byType: typeCounts, byPriority: priorityCounts };
  }
}

export const maintenanceService = new MaintenanceService();
