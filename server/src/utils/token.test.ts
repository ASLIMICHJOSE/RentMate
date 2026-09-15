import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';
import { durationToMilliseconds, signAccessToken, verifyAccessToken } from './token.js';

describe('durationToMilliseconds', () => {
  it('converts the units used in configuration', () => {
    expect(durationToMilliseconds('7d')).toBe(7 * 86_400_000);
    expect(durationToMilliseconds('15m')).toBe(15 * 60_000);
    expect(durationToMilliseconds('1h')).toBe(3_600_000);
    expect(durationToMilliseconds('30s')).toBe(30_000);
    expect(durationToMilliseconds('500ms')).toBe(500);
  });

  it('treats a bare number as seconds, matching jsonwebtoken', () => {
    expect(durationToMilliseconds('900')).toBe(900_000);
  });

  it('tolerates surrounding whitespace and casing', () => {
    expect(durationToMilliseconds(' 7D ')).toBe(7 * 86_400_000);
  });

  it('returns undefined for input it cannot understand', () => {
    expect(durationToMilliseconds('soon')).toBeUndefined();
    expect(durationToMilliseconds('')).toBeUndefined();
    expect(durationToMilliseconds('7w')).toBeUndefined();
  });
});

describe('access tokens', () => {
  it('round-trips the user id and role', () => {
    const token = signAccessToken('user-123', 'OWNER');
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.role).toBe('OWNER');
  });

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ role: 'ADMIN' }, 'a-completely-different-secret-value', {
      subject: 'user-123',
    });

    expect(() => verifyAccessToken(forged)).toThrow(ApiError);

    try {
      verifyAccessToken(forged);
    } catch (error) {
      expect((error as ApiError).statusCode).toBe(401);
      expect((error as ApiError).code).toBe('INVALID_TOKEN');
    }
  });

  it('reports an expired token separately so the client can re-authenticate', () => {
    const expired = jwt.sign({ role: 'STUDENT' }, env.JWT_SECRET, {
      subject: 'user-123',
      expiresIn: -60,
    });

    try {
      verifyAccessToken(expired);
      throw new Error('expected verifyAccessToken to throw');
    } catch (error) {
      expect((error as ApiError).code).toBe('SESSION_EXPIRED');
    }
  });

  it('rejects a token whose claims do not match the expected shape', () => {
    const missingRole = jwt.sign({}, env.JWT_SECRET, { subject: 'user-123' });

    expect(() => verifyAccessToken(missingRole)).toThrow(ApiError);
  });
});
