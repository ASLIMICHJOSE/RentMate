import jwt, { type SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { USER_ROLES, type AccessTokenPayload, type UserRole } from '../types/auth.js';
import { ApiError } from './ApiError.js';

const payloadSchema = z.object({
  sub: z.string().min(1),
  role: z.enum(USER_ROLES),
});

/**
 * Signs an access token.
 *
 * The payload carries only the user id and role: everything else is loaded from
 * the database on each request, so suspended accounts lose access immediately
 * instead of keeping a valid token until it expires.
 */
export function signAccessToken(userId: string, role: UserRole): string {
  const options: SignOptions = {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign({ role }, env.JWT_SECRET, options);
}

/** Verifies a token and returns its claims, or throws a 401 `ApiError`. */
export function verifyAccessToken(token: string): AccessTokenPayload {
  let decoded: unknown;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    const expired = error instanceof jwt.TokenExpiredError;
    throw new ApiError(
      401,
      expired ? 'SESSION_EXPIRED' : 'INVALID_TOKEN',
      expired ? 'Your session has expired. Please sign in again.' : 'Invalid session token',
    );
  }

  const parsed = payloadSchema.safeParse(decoded);

  if (!parsed.success) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Invalid session token');
  }

  return parsed.data;
}

const DURATION_UNITS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/**
 * Converts a duration such as `7d`, `15m` or `900` (seconds) to milliseconds.
 *
 * Returns `undefined` for anything unrecognised, which makes the session cookie
 * a browser-session cookie instead of failing the request.
 */
export function durationToMilliseconds(duration: string): number | undefined {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(duration.trim());

  if (!match) return undefined;

  const amount = Number(match[1]);
  // jsonwebtoken treats a bare number as seconds.
  const unit = match[2]?.toLowerCase() ?? 's';
  const multiplier = DURATION_UNITS[unit];

  if (!Number.isFinite(amount) || multiplier === undefined) return undefined;

  return amount * multiplier;
}
