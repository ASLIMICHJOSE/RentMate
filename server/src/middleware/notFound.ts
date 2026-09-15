import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/** Converts unmatched routes into a 404 error handled by the error handler. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(
    ApiError.notFound(`Route ${req.method} ${req.originalUrl} does not exist`, 'ROUTE_NOT_FOUND'),
  );
}
