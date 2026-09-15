import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiFailure } from '../types/api';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Single Axios instance for the whole app.
 *
 * Cookies are sent with `withCredentials` so the httpOnly auth cookie set by
 * the server works in development (proxied origin) and production.
 */
export const http: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Normalised error thrown by the API layer so UI code never reads Axios internals. */
export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiFailure>) => {
    if (error.response) {
      const body = error.response.data;
      const apiError = body?.error;

      return Promise.reject(
        new ApiRequestError(
          apiError?.message ?? 'The request failed. Please try again.',
          apiError?.code ?? 'REQUEST_FAILED',
          error.response.status,
          apiError?.details,
        ),
      );
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new ApiRequestError('The request timed out. Please try again.', 'REQUEST_TIMEOUT', 0),
      );
    }

    return Promise.reject(
      new ApiRequestError(
        'Could not reach the RentMate API. Is the server running?',
        'NETWORK_ERROR',
        0,
      ),
    );
  },
);
