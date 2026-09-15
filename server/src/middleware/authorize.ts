import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { UserRole } from '../types/auth.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Restricts a route to the given roles.
 *
 * Always used after `authenticate`; the frontend's idea of the current role is
 * never trusted, so every privileged route re-checks it here.
 */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized('Sign in to continue', 'UNAUTHENTICATED'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        ApiError.forbidden(
          'Your account does not have access to this resource',
          'INSUFFICIENT_ROLE',
        ),
      );
      return;
    }

    next();
  };
}
