import { Router } from 'express';
import { healthRouter } from './health.routes';

/**
 * Root API router mounted at `/api`.
 *
 * Feature routers are registered here as milestones land:
 * Milestone 4  -> /auth, Milestone 5 -> /users
 * Milestone 6  -> /properties, Milestone 10 -> /roommates
 * Milestone 14 -> /conversations, Milestone 16 -> /reviews
 * Milestone 17 -> /reports, Milestone 18 -> /admin
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
