import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../utils/ApiError.js';
import { errorHandler } from './errorHandler.js';

/**
 * `errorHandler` behaves differently in production: unexpected errors must be
 * reported without exposing messages, stack traces or database details.
 * The env module is mocked so this branch is exercised directly.
 */
vi.mock('../config/env.js', () => ({
  env: { NODE_ENV: 'production' },
  isProduction: true,
  isDevelopment: false,
  isTest: false,
}));

function createResponse() {
  const response = {
    statusCode: 0,
    payload: undefined as unknown,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(body: unknown) {
      response.payload = body;
      return response;
    },
  };

  return response as unknown as Response & { statusCode: number; payload: unknown };
}

function asNext(next: ReturnType<typeof vi.fn>): NextFunction {
  return next as unknown as NextFunction;
}

describe('errorHandler in production', () => {
  it('hides the internals of unexpected errors but still returns the envelope', () => {
    const res = createResponse();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(
      new Error('connect ECONNREFUSED 127.0.0.1:5432 (password=secret)'),
      {} as Request,
      res,
      asNext(vi.fn()),
    );

    expect(res.statusCode).toBe(500);
    expect(res.payload).toEqual({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on our end' },
    });

    // The details are still logged server-side for debugging.
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('still reports expected operational errors accurately', () => {
    const res = createResponse();

    errorHandler(
      ApiError.conflict('Email already registered', 'EMAIL_IN_USE'),
      {} as Request,
      res,
      asNext(vi.fn()),
    );

    expect(res.statusCode).toBe(409);
    expect(res.payload).toEqual({
      success: false,
      error: { code: 'EMAIL_IN_USE', message: 'Email already registered' },
    });
  });

  it('keeps validation details, which contain no server internals', () => {
    const res = createResponse();

    errorHandler(
      ApiError.badRequest('Request validation failed', 'VALIDATION_ERROR', [
        { field: 'password', message: 'Use at least 8 characters' },
      ]),
      {} as Request,
      res,
      asNext(vi.fn()),
    );

    expect(res.statusCode).toBe(400);
    expect(res.payload).toMatchObject({
      error: { code: 'VALIDATION_ERROR', details: [{ field: 'password' }] },
    });
  });
});
