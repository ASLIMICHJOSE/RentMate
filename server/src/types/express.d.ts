import type { CurrentUser } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by the `authenticate` middleware. */
      user?: CurrentUser;
      /** Set by the `validate` middleware after Zod parsing. */
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
