import Fastify from 'fastify';
import { db, closeDatabaseConnection } from '@eamaim/database';
import { sensorReadings, telemetryEvents } from '@eamaim/database/schema';
import { sql, eq } from 'drizzle-orm';

const server = Fastify({
  logger: { level: process.env.LOG_LEVEL || 'info' },
});

// ── Telemetry ingestion buffer ──
interface Reading {
  sensorId: string;
  value: number;
  time: string;
  tenantId: string;
  quality?: string;
  metadata?: Record<string, any>;
}

let buffer: Reading[] = [];
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);
const FLUSH_INTERVAL = parseInt(process.env.FLUSH_INTERVAL_MS || '5000', 10);
let totalIngested = 0;
let totalFlushed = 0;

async function flushBuffer() {
  if (buffer.length === 0) return;
  const batch = buffer.splice(0, buffer.length);

  try {
    // Batch INSERT into sensor_readings hypertable using raw SQL for performance
    const valueRows = batch.map(r =>
      `('${r.sensorId}', '${r.tenantId}', '${r.time || new Date().toISOString()}', ${r.value}, '${r.quality || 'GOOD'}')`
    ).join(',\n');

    await db.execute(sql.raw(`
      INSERT INTO sensor_readings (sensor_id, tenant_id, time, value, quality)
      VALUES ${valueRows}
      ON CONFLICT DO NOTHING
    `));

    totalFlushed += batch.length;
    server.log.info(`Flushed ${batch.length} readings to TimescaleDB (total: ${totalFlushed})`);
  } catch (err: any) {
    // Re-add to buffer on failure
    buffer.unshift(...batch);
    server.log.error(`Flush failed: ${err.message} — ${batch.length} readings re-queued`);
  }
}

// Periodic flush
const flushTimer = setInterval(flushBuffer, FLUSH_INTERVAL);

// ── HTTP ingestion endpoint (single/few readings) ──
server.post('/ingest', async (request, reply) => {
  const readings = Array.isArray(request.body) ? request.body as Reading[] : [request.body as Reading];

  // Basic validation
  for (const r of readings) {
    if (!r.sensorId || r.value === undefined || !r.tenantId) {
      return reply.code(400).send({ error: 'Each reading requires sensorId, value, tenantId' });
    }
  }

  buffer.push(...readings);
  totalIngested += readings.length;

  if (buffer.length >= BATCH_SIZE) {
    await flushBuffer();
  }

  return { accepted: readings.length, bufferSize: buffer.length };
});

// ── Batch ingestion endpoint (high-throughput) ──
server.post('/ingest/batch', async (request, reply) => {
  const { readings } = request.body as { readings: Reading[] };
  if (!readings || !Array.isArray(readings)) {
    return reply.code(400).send({ error: 'Body must contain readings array' });
  }

  buffer.push(...readings);
  totalIngested += readings.length;

  // Auto-flush if batch is large enough
  if (buffer.length >= BATCH_SIZE) {
    await flushBuffer();
  }

  return { accepted: readings.length, bufferSize: buffer.length };
});

// ── Event ingestion (alarms, state changes) ──
server.post('/events', async (request, reply) => {
  const events = Array.isArray(request.body) ? request.body : [request.body];

  for (const event of events as any[]) {
    await db.insert(telemetryEvents).values({
      tenantId: event.tenantId,
      sensorId: event.sensorId,
      eventType: event.eventType || 'ALARM',
      severity: event.severity || 'WARNING',
      message: event.message,
      value: event.value ? String(event.value) : null,
      metadata: event.metadata || {},
    });
  }

  return { accepted: events.length };
});

// ── Flush on demand ──
server.post('/flush', async () => {
  await flushBuffer();
  return { flushed: true, bufferSize: buffer.length };
});

// ── Health ──
server.get('/health', async () => ({
  status: 'ok',
  bufferSize: buffer.length,
  totalIngested,
  totalFlushed,
  batchSize: BATCH_SIZE,
  flushIntervalMs: FLUSH_INTERVAL,
  timestamp: new Date().toISOString(),
}));

// ── Metrics ──
server.get('/metrics', async () => ({
  totalIngested,
  totalFlushed,
  bufferSize: buffer.length,
  droppedReadings: totalIngested - totalFlushed - buffer.length,
  uptimeSeconds: process.uptime(),
}));

// ── Graceful shutdown ──
async function shutdown(signal: string) {
  server.log.info(`${signal} received — flushing buffer...`);
  clearInterval(flushTimer);
  await flushBuffer();
  await server.close();
  await closeDatabaseConnection();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Start ──
const port = parseInt(process.env.PORT || '3002', 10);
server.listen({ port, host: '0.0.0.0' }).then(() => {
  server.log.info(`📡 Telemetry Ingestion Service running on port ${port}`);
  server.log.info(`   Batch size: ${BATCH_SIZE}, Flush interval: ${FLUSH_INTERVAL}ms`);
});
