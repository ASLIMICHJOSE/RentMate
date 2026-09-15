import type { Request, Response } from 'express';
import { env } from '../config/env';
import { sendSuccess } from '../utils/apiResponse';

export interface HealthPayload {
  status: 'ok';
  service: string;
  environment: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
}

/** `GET /api/health` - liveness probe used by clients, tests and deployments. */
export function getHealth(_req: Request, res: Response): void {
  sendSuccess<HealthPayload>(res, {
    status: 'ok',
    service: 'rentmate-api',
    environment: env.NODE_ENV,
    version: process.env.npm_package_version ?? '0.1.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
