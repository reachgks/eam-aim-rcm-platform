import { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '@eamaim/database';

export async function reportsRoutes(server: FastifyInstance) {
  // Asset summary report
  server.get('/assets/summary', async (request) => {
    const result = await db.execute(sql`
      SELECT status, criticality, COUNT(*) as count
      FROM assets WHERE tenant_id = ${request.tenantId}
      GROUP BY GROUPING SETS ((status), (criticality))
    `);
    return { data: result.rows };
  });

  // Work order KPIs
  server.get('/maintenance/kpis', async (request) => {
    const result = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
        COUNT(*) FILTER (WHERE status = 'OVERDUE') as overdue,
        COUNT(*) as total,
        ROUND(AVG(EXTRACT(EPOCH FROM (actual_end - actual_start))/3600)::numeric, 1) as avg_duration_hours
      FROM work_orders WHERE tenant_id = ${request.tenantId}
    `);
    return { data: result.rows[0] };
  });

  // Cost summary by category
  server.get('/financials/cost-summary', async (request) => {
    const { assetId } = request.query as any;
    const assetFilter = assetId ? sql`AND asset_id = ${assetId}` : sql``;
    const result = await db.execute(sql`
      SELECT cost_category, SUM(amount)::numeric(15,2) as total_amount, COUNT(*) as transaction_count
      FROM cost_transactions
      WHERE tenant_id = ${request.tenantId} ${assetFilter}
      GROUP BY cost_category ORDER BY total_amount DESC
    `);
    return { data: result.rows };
  });

  // Inventory valuation
  server.get('/inventory/valuation', async (request) => {
    const result = await db.execute(sql`
      SELECT s.name as storeroom, COUNT(DISTINCT sl.stock_item_id) as item_count,
        SUM(sl.quantity_on_hand * si.unit_cost)::numeric(15,2) as total_value
      FROM stock_levels sl
      JOIN stock_items si ON sl.stock_item_id = si.id
      JOIN storerooms s ON sl.storeroom_id = s.id
      WHERE si.tenant_id = ${request.tenantId}
      GROUP BY s.name ORDER BY total_value DESC
    `);
    return { data: result.rows };
  });

  // Compliance overview
  server.get('/regulatory/compliance', async (request) => {
    const result = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM inspections WHERE tenant_id = ${request.tenantId} AND result = 'PASS') as passed,
        (SELECT COUNT(*) FROM inspections WHERE tenant_id = ${request.tenantId} AND result = 'FAIL') as failed,
        (SELECT COUNT(*) FROM violations WHERE tenant_id = ${request.tenantId} AND violation_status = 'OPEN') as open_violations,
        (SELECT COUNT(*) FROM corrective_actions WHERE tenant_id = ${request.tenantId} AND ca_status = 'OPEN') as open_cas
    `);
    return { data: result.rows[0] };
  });
}
