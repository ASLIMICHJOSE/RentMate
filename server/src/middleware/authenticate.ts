import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { findCurrentUser } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { AUTH_COOKIE_NAME } from '../utils/cookies.js';
import { verifyAccessToken } from '../utils/token.js';

/**
 * Extracts the access token from the httpOnly cookie.
 *
 * A `Authorization: Bearer <token>` header is also accepted so API clients such
 * as Postman can authenticate without cookie handling.
 */
function readAccessToken(req: Request): string | null {
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.[AUTH_COOKIE_NAME];

  if (cookieToken) return cookieToken;

  const header = req.get('authorization');

  if (header?.toLowerCase().startsWith('bearer ')) {
    return header.slice('bearer '.length).trim() || null;
  }

  return null;
}

/**
 * Requires a signed-in user.
 *
 * The user is re-read from the database on every request so role changes and
 * suspensions take effect immediately, rather than trusting the token contents.
 */
export const authenticate: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = readAccessToken(req);

    if (!token) {
      throw ApiError.unauthorized('Sign in to continue', 'UNAUTHENTICATED');
    }

    const payload = verifyAccessToken(token);
    const user = await findCurrentUser(payload.sub);

    if (!user) {
      throw ApiError.unauthorized('Your session is no longer valid', 'SESSION_INVALID');
    }

    if (!user.isActive) {
      throw ApiError.forbidden(
        'This account has been suspended. Contact support for help.',
        'ACCOUNT_SUSPENDED',
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
