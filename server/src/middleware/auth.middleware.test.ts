import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import type { CurrentUser } from '../types/auth.js';
import { ApiError } from '../utils/ApiError.js';
import { loginSchema } from '../validators/auth.validator.js';
import { errorHandler } from './errorHandler.js';
import { requireRole } from './authorize.js';
import { validate, validatedBody } from './validate.js';

const studentUser: CurrentUser = {
  id: 'user-1',
  name: 'Aditya Sharma',
  email: 'aditya@example.com',
  role: 'STUDENT',
  avatarUrl: null,
  isActive: true,
  createdAt: new Date('2026-09-01T00:00:00.000Z'),
  profile: null,
};

type NextSpy = ReturnType<typeof vi.fn>;

/** Express 5's NextFunction is overloaded, so mocks are cast at the call site. */
function createNext(): NextSpy {
  return vi.fn();
}

function asNext(next: NextSpy): NextFunction {
  return next as unknown as NextFunction;
}

function firstNextError(next: NextSpy): ApiError {
  const [error] = next.mock.calls[0] ?? [];
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

/** Minimal Express response double that records status and body. */
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

describe('validate middleware', () => {
  it('stores parsed input on req.validated instead of mutating the request', () => {
    const req = {
      body: { email: '  USER@example.com ', password: 'Password123' },
    } as unknown as Request;
    const next = createNext();

    validate({ body: loginSchema })(req, createResponse(), asNext(next));

    expect(next).toHaveBeenCalledWith();
    expect(req.validated?.body).toEqual({ email: 'user@example.com', password: 'Password123' });
    // The raw body is untouched, so Express 5 getters stay intact.
    expect(req.body).toEqual({ email: '  USER@example.com ', password: 'Password123' });
  });

  it('forwards validation failures to the error handler', () => {
    const req = { body: { email: 'nope' } } as unknown as Request;
    const next = createNext();

    validate({ body: loginSchema })(req, createResponse(), asNext(next));

    expect(next).toHaveBeenCalledTimes(1);
    const [error] = next.mock.calls[0] ?? [];
    expect((error as { name?: string }).name).toBe('ZodError');
  });

  it('throws a 500 when a controller reads a body that was never validated', () => {
    expect(() => validatedBody({} as unknown as Request)).toThrow(ApiError);
  });
});

describe('requireRole middleware', () => {
  it('allows a user whose role is listed', () => {
    const next = createNext();

    requireRole('STUDENT', 'ADMIN')(
      { user: studentUser } as unknown as Request,
      createResponse(),
      asNext(next),
    );

    expect(next).toHaveBeenCalledWith();
  });

  it('blocks a role that is not listed with 403', () => {
    const next = createNext();

    requireRole('OWNER', 'ADMIN')(
      { user: studentUser } as unknown as Request,
      createResponse(),
      asNext(next),
    );

    const error = firstNextError(next);
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('INSUFFICIENT_ROLE');
  });

  it('blocks anonymous requests with 401', () => {
    const next = createNext();

    requireRole('ADMIN')({} as unknown as Request, createResponse(), asNext(next));

    expect(firstNextError(next).statusCode).toBe(401);
  });
});

describe('errorHandler', () => {
  it('maps Zod failures to a 400 with per-field details', () => {
    const res = createResponse();
    const { error } = loginSchema.safeParse({ email: 'nope', password: '' });

    errorHandler(error, {} as Request, res, asNext(createNext()));

    expect(res.statusCode).toBe(400);
    expect(res.payload).toMatchObject({ success: false, error: { code: 'VALIDATION_ERROR' } });

    const details = (res.payload as { error: { details: { field: string }[] } }).error.details;
    expect(details.map((detail) => detail.field)).toContain('email');
  });

  it('maps ApiError to its status code and error code', () => {
    const res = createResponse();

    errorHandler(
      ApiError.notFound('No such listing', 'PROPERTY_NOT_FOUND'),
      {} as Request,
      res,
      asNext(createNext()),
    );

    expect(res.statusCode).toBe(404);
    expect(res.payload).toEqual({
      success: false,
      error: { code: 'PROPERTY_NOT_FOUND', message: 'No such listing' },
    });
  });

  it('never leaks internals for unexpected errors', () => {
    const res = createResponse();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(new Error('connection string leaked'), {} as Request, res, asNext(createNext()));

    expect(res.statusCode).toBe(500);
    expect(res.payload).toMatchObject({ error: { code: 'INTERNAL_ERROR' } });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
