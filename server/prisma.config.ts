import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI configuration (Prisma 7).
 *
 * The CLI no longer reads `.env` automatically, so `dotenv/config` is imported
 * above. Migrations need a *direct* database connection, while the running API
 * uses the pooled `DATABASE_URL`:
 *
 *   DIRECT_URL    - Supabase direct connection (port 5432), preferred here
 *   DATABASE_URL  - fallback, and what the API uses at runtime
 *
 * Falling back keeps `prisma generate` (part of `npm run build`) working in
 * environments where only one connection string is configured.
 */
const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});
