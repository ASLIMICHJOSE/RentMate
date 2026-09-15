import { defineConfig } from 'vitest/config';

/**
 * Unit tests run without a database.
 *
 * Environment variables are provided here so `config/env.ts` passes its
 * validation; `dotenv` never overrides values that are already set, so the real
 * `server/.env` cannot leak into tests.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/rentmate_test',
      JWT_SECRET: 'test-only-secret-value-with-more-than-32-characters',
      JWT_EXPIRES_IN: '7d',
      COOKIE_SECURE: 'false',
      COOKIE_SAME_SITE: 'lax',
    },
  },
});
