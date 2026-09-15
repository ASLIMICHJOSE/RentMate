import { z } from 'zod';

/** Email is normalised so `A@B.com` and `a@b.com` are the same account. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(160, 'Email address is too long')
  .pipe(z.email('Enter a valid email address'));

/** Mirrors the client-side rules; the server is the authoritative copy. */
export const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Passwords cannot be longer than 72 characters')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number');

/**
 * Registration input.
 *
 * `role` deliberately excludes `ADMIN`: admin accounts are never self-service.
 */
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80, 'Name is too long'),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['STUDENT', 'OWNER'], { message: 'Choose how you will use RentMate' }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password').max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
