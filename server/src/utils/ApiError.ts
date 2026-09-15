/**
 * Operational error type thrown by services/controllers.
 *
 * The error handler is the only place allowed to translate errors into HTTP
 * responses, which keeps response codes and payloads consistent.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(
    message = 'Invalid request',
    code = 'BAD_REQUEST',
    details?: unknown,
  ): ApiError {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHENTICATED'): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(message = 'You are not allowed to do that', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, code, message);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(message = 'Resource already exists', code = 'CONFLICT'): ApiError {
    return new ApiError(409, code, message);
  }

  static payloadTooLarge(
    message = 'Uploaded file is too large',
    code = 'PAYLOAD_TOO_LARGE',
  ): ApiError {
    return new ApiError(413, code, message);
  }

  static tooManyRequests(message = 'Too many requests', code = 'RATE_LIMITED'): ApiError {
    return new ApiError(429, code, message);
  }
}
