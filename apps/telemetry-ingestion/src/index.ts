import Fastify from 'fastify';

const server = Fastify({
  logger: { level: process.env.LOG_LEVEL || 'info' },
});

// Telemetry ingestion buffer
let buffer: Array<{ sensorId: string; value: number; time: string; tenantId: string }> = [];
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);
const FLUSH_INTERVAL = parseInt(process.env.FLUSH_INTERVAL_MS || '5000', 10);

async function flushBuffer() {
  if (buffer.length === 0) return;
  const batch = buffer.splice(0, buffer.length);
  server.log.info(`Flushing ${batch.length} sensor readings to TimescaleDB`);
  // TODO: Batch INSERT into sensor_readings hypertable
}

setInterval(flushBuffer, FLUSH_INTERVAL);

// HTTP ingestion endpoint
server.post('/ingest', async (request, reply) => {
  const readings = request.body as any[];
  buffer.push(...readings);

  if (buffer.length >= BATCH_SIZE) {
    await flushBuffer();
  }

  return { accepted: readings.length, bufferSize: buffer.length };
});

// Batch ingestion
server.post('/ingest/batch', async (request, reply) => {
  const { readings } = request.body as any;
  buffer.push(...readings);
  return { accepted: readings.length };
});

// Health
server.get('/health', async () => ({
  status: 'ok',
  bufferSize: buffer.length,
  timestamp: new Date().toISOString(),
}));

const port = parseInt(process.env.PORT || '3002', 10);
server.listen({ port, host: '0.0.0.0' }).then(() => {
  server.log.info(`📡 Telemetry Ingestion Service running on port ${port}`);
  server.log.info(`   Batch size: ${BATCH_SIZE}, Flush interval: ${FLUSH_INTERVAL}ms`);
});
