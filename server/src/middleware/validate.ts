import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Validates and coerces request input with Zod.
 *
 * Parsed values are stored on `req.validated` rather than written back to
 * `req.body` / `req.query`, because Express 5 exposes `req.query` as a getter.
 * Failures are forwarded as `ZodError`, which the error handler turns into a
 * `400 VALIDATION_ERROR` response with per-field details.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.validated = {
        body: schemas.body ? schemas.body.parse(req.body) : undefined,
        query: schemas.query ? schemas.query.parse(req.query) : undefined,
        params: schemas.params ? schemas.params.parse(req.params) : undefined,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/** Reads a validated body inside a controller, with a clear error if misused. */
export function validatedBody<T>(req: Request): T {
  if (req.validated?.body === undefined) {
    throw new ApiError(
      500,
      'VALIDATION_MISSING',
      'Internal error: this route is missing body validation',
    );
  }

  return req.validated.body as T;
}
