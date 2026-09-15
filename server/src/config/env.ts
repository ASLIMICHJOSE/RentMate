import dotenv from 'dotenv';
import { z } from 'zod';

// Load `.env` before anything reads process.env. Importing this module is the
// only supported way for the rest of the app to access configuration.
dotenv.config({ quiet: true });

/** Treats an empty env value as "not provided" so `.env` files can stay explicit. */
const optionalString = () =>
  z.preprocess((value) => (value === '' ? undefined : value), z.string().optional());

/** Parses "true"/"false" strings from the environment into a real boolean. */
const booleanFromString = (fallback: boolean) =>
  z.preprocess(
    (value) =>
      value === undefined || value === '' ? fallback : value === 'true' || value === true,
    z.boolean(),
  );

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_URL: z.string().min(1).default('http://localhost:5173'),
  SERVER_URL: z.string().min(1).default('http://localhost:5000'),
  LOG_LEVEL: z.enum(['tiny', 'dev', 'combined']).default('dev'),

  // Introduced in Milestone 3 (database) - optional until then.
  DATABASE_URL: optionalString(),

  // Introduced in Milestone 4 (authentication) - optional until then.
  JWT_SECRET: optionalString(),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  COOKIE_SECURE: booleanFromString(false),

  // Introduced in Milestone 15 (image uploads) - optional until then.
  CLOUDINARY_CLOUD_NAME: optionalString(),
  CLOUDINARY_API_KEY: optionalString(),
  CLOUDINARY_API_SECRET: optionalString(),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');

  console.error(`Invalid environment configuration:\n${issues}\n`);
  console.error('Check server/.env against server/.env.example.');
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

export type Env = typeof env;
