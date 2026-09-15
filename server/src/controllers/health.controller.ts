import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/apiResponse.js';

export interface HealthPayload {
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    status: 'up' | 'down';
    latencyMs: number | null;
  };
}

/** Cheapest possible round trip that proves the database is reachable. */
async function checkDatabase(): Promise<HealthPayload['database']> {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'up', latencyMs: Date.now() - startedAt };
  } catch (error) {
    console.error('[health] database check failed:', error);
    return { status: 'down', latencyMs: null };
  }
}

/** `GET /api/health` - liveness probe used by clients, tests and deployments. */
export async function getHealth(_req: Request, res: Response): Promise<void> {
  const database = await checkDatabase();

  sendSuccess<HealthPayload>(res, {
    status: database.status === 'up' ? 'ok' : 'degraded',
    service: 'rentmate-api',
    environment: env.NODE_ENV,
    version: process.env.npm_package_version ?? '0.1.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database,
  });
}
