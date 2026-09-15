import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { failure, type ApiErrorBody } from '../utils/apiResponse';
import { isProduction } from '../config/env';

/** Body-parser throws this when the request body is not valid JSON. */
interface BodyParserError extends SyntaxError {
  status?: number;
  type?: string;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    error instanceof SyntaxError &&
    'status' in error &&
    'body' in error &&
    (error as BodyParserError).type === 'entity.parse.failed'
  );
}

interface HttpStatusError {
  status?: number;
  statusCode?: number;
  message?: string;
}

function isHttpStatusError(error: unknown): error is HttpStatusError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('status' in error || 'statusCode' in error) &&
    !(error instanceof ApiError)
  );
}

/**
 * Centralised error handler. Must be registered last, after all routes.
 *
 * Unknown errors are logged server-side but never leak stack traces or
 * database details to the client.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong on our end';
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = error.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
  } else if (isBodyParserError(error)) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Request body must be valid JSON';
  } else if (isHttpStatusError(error)) {
    const status = error.status ?? error.statusCode ?? 500;
    if (status >= 400 && status < 500) {
      statusCode = status;
      code = 'REQUEST_FAILED';
      message = error.message ?? 'The request could not be processed';
    }
  }

  const isUnexpected = statusCode >= 500;

  if (isUnexpected) {
    console.error('[error]', error);
    if (isProduction) {
      message = 'Something went wrong on our end';
      details = undefined;
    } else if (error instanceof Error) {
      message = error.message;
      details = { stack: error.stack };
    }
  }

  const body: ApiErrorBody = failure(code, message, details);
  res.status(statusCode).json(body);
}
