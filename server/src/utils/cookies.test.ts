import type { Response } from 'express';
import { describe, expect, it } from 'vitest';
import { AUTH_COOKIE_NAME, authCookieOptions, clearAuthCookie, setAuthCookie } from './cookies.js';

interface CookieCall {
  name: string;
  options: Record<string, unknown>;
}

function createResponse() {
  const response = {
    cookieCalls: [] as CookieCall[],
    clearCalls: [] as CookieCall[],
    cookie(name: string, _value: string, options: Record<string, unknown>) {
      response.cookieCalls.push({ name, options });
      return response;
    },
    clearCookie(name: string, options: Record<string, unknown>) {
      response.clearCalls.push({ name, options });
      return response;
    },
  };

  return response as unknown as Response & {
    cookieCalls: CookieCall[];
    clearCalls: CookieCall[];
  };
}

describe('auth cookie options', () => {
  it('keeps the token out of JavaScript reach', () => {
    const options = authCookieOptions();

    expect(options.httpOnly).toBe(true);
    expect(options.path).toBe('/');
    expect(options.sameSite).toBe('lax');
  });

  it('is not marked secure outside production unless configured', () => {
    expect(authCookieOptions().secure).toBe(false);
  });

  it('aligns the cookie lifetime with the token lifetime', () => {
    // JWT_EXPIRES_IN is 7d in the test environment.
    expect(authCookieOptions().maxAge).toBe(7 * 86_400_000);
  });
});

describe('cookie helpers', () => {
  it('sets the session cookie with the hardened options', () => {
    const res = createResponse();

    setAuthCookie(res, 'signed-token');

    expect(res.cookieCalls).toHaveLength(1);
    expect(res.cookieCalls[0]?.name).toBe(AUTH_COOKIE_NAME);
    expect(res.cookieCalls[0]?.options.httpOnly).toBe(true);
  });

  it('clears the cookie without a maxAge so the browser removes it', () => {
    const res = createResponse();

    clearAuthCookie(res);

    expect(res.clearCalls).toHaveLength(1);
    expect(res.clearCalls[0]?.name).toBe(AUTH_COOKIE_NAME);
    expect(res.clearCalls[0]?.options).not.toHaveProperty('maxAge');
  });
});
