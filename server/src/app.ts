import { env, isDevelopment, isProduction } from './config/env';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { ApiError } from './utils/ApiError';
import { failure } from './utils/apiResponse';

/**
 * Builds the Express application.
 *
 * Kept separate from `server.ts` so tests can import the app without starting
 * a listener.
 */
export function createApp(): Express {
  const app = express();

  // Don't advertise the framework.
  app.disable('x-powered-by');

  // Required for correct client IPs (and secure cookies) behind a proxy.
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // --- Security ------------------------------------------------------------
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );

  // --- Parsing -------------------------------------------------------------
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // --- Observability -------------------------------------------------------
  if (isDevelopment) {
    app.use(morgan(env.LOG_LEVEL));
  }

  // --- Rate limiting (applies to the whole API surface) --------------------
  const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      const error = ApiError.tooManyRequests();
      res.status(error.statusCode).json(failure(error.code, error.message));
    },
  });

  // --- Routes --------------------------------------------------------------
  app.use('/api', apiLimiter, apiRouter);

  // Unmatched routes and errors are handled in one place.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
