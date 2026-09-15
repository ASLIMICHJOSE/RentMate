import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env, isProduction } from './env.js';

/**
 * Single shared Prisma client.
 *
 * Prisma 7 talks to PostgreSQL through a driver adapter (`node-postgres`), so
 * the connection pool is owned by `pg` rather than the Rust query engine.
 */
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  // Supabase's pooler closes idle connections; keep the pool small and recycle.
  max: isProduction ? 10 : 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export const prisma = new PrismaClient({
  adapter,
  log: isProduction ? ['error'] : ['warn', 'error'],
});

/** Closes the pool - called during graceful shutdown. */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
