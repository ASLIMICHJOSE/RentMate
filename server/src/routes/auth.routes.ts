import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, postLogin, postLogout, postRegister } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { failure } from '../utils/apiResponse.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

export const authRouter = Router();

/**
 * Credential endpoints get a much tighter limit than the rest of the API so
 * password guessing is expensive even from a single IP.
 */
const credentialLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const error = ApiError.tooManyRequests(
      'Too many attempts. Please wait a few minutes and try again.',
      'AUTH_RATE_LIMITED',
    );
    res.status(error.statusCode).json(failure(error.code, error.message));
  },
});

authRouter.post('/register', credentialLimiter, validate({ body: registerSchema }), postRegister);
authRouter.post('/login', credentialLimiter, validate({ body: loginSchema }), postLogin);
authRouter.post('/logout', postLogout);
authRouter.get('/me', authenticate, getMe);
