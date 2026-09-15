import type { CookieOptions, Response } from 'express';
import { env, isProduction } from '../config/env.js';
import { durationToMilliseconds } from './token.js';

/** Name of the httpOnly cookie carrying the access token. */
export const AUTH_COOKIE_NAME = 'rentmate_token';

/**
 * Cookie options for the session cookie.
 *
 * `httpOnly` keeps the token out of reach of JavaScript (so an XSS bug cannot
 * steal it) and `secure` is forced on in production so it only travels over
 * HTTPS. `sameSite` defaults to `lax`; set `COOKIE_SAME_SITE=none` when the
 * client and API are on different sites (for example Vercel + Render).
 */
export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: durationToMilliseconds(env.JWT_EXPIRES_IN),
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  // `maxAge`/`expires` must be omitted so the browser drops the cookie.
  const { maxAge: _maxAge, ...options } = authCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}
