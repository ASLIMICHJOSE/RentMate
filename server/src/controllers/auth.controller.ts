import type { Request, Response } from 'express';
import { validatedBody } from '../middleware/validate.js';
import { authenticateUser, registerUser } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { clearAuthCookie, setAuthCookie } from '../utils/cookies.js';
import { signAccessToken } from '../utils/token.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';

/**
 * Auth controllers.
 *
 * They stay thin: validation happens in middleware, business rules in
 * `services/auth.service.ts`, and rejected promises are forwarded to the error
 * handler by Express 5, so no try/catch is needed here.
 */

/** `POST /api/auth/register` */
export async function postRegister(req: Request, res: Response): Promise<void> {
  const input = validatedBody<RegisterInput>(req);
  const user = await registerUser(input);

  setAuthCookie(res, signAccessToken(user.id, user.role));
  sendSuccess(res, { user }, 201);
}

/** `POST /api/auth/login` */
export async function postLogin(req: Request, res: Response): Promise<void> {
  const input = validatedBody<LoginInput>(req);
  const user = await authenticateUser(input);

  setAuthCookie(res, signAccessToken(user.id, user.role));
  sendSuccess(res, { user });
}

/** `POST /api/auth/logout` - clears the session cookie. */
export function postLogout(_req: Request, res: Response): void {
  clearAuthCookie(res);
  sendSuccess(res, { message: 'Signed out' });
}

/** `GET /api/auth/me` - the user attached by the `authenticate` middleware. */
export function getMe(req: Request, res: Response): void {
  if (!req.user) {
    throw ApiError.unauthorized('Sign in to continue', 'UNAUTHENTICATED');
  }

  sendSuccess(res, { user: req.user });
}
