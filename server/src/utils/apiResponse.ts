import type { Response } from 'express';

/** Successful response envelope: `{ "success": true, "data": ... }`. */
export interface ApiSuccessBody<T> {
  success: true;
  data: T;
}

/** Error response envelope: `{ "success": false, "error": { code, message } }`. */
export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponseBody<T> = ApiSuccessBody<T> | ApiErrorBody;

/** Builds the standard success payload. */
export function success<T>(data: T): ApiSuccessBody<T> {
  return { success: true, data };
}

/** Builds and sends the standard success payload. */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json(success(data));
}

/** Builds the standard error payload. */
export function failure(code: string, message: string, details?: unknown): ApiErrorBody {
  return {
    success: false,
    error: details === undefined ? { code, message } : { code, message, details },
  };
}
