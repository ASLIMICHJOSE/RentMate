import { http } from './http';
import type { ApiSuccess } from '../types/api';

export interface HealthPayload {
  status: 'ok';
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
}

/** Calls `GET /api/health` - used to verify client/server connectivity. */
export async function fetchHealth(): Promise<HealthPayload> {
  const response = await http.get<ApiSuccess<HealthPayload>>('/health');
  return response.data.data;
}
