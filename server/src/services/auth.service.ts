import { prisma } from '../config/prisma.js';
import type { CurrentUser } from '../types/auth.js';
import { ApiError } from '../utils/ApiError.js';
import { TIMING_EQUALISATION_HASH, hashPassword, verifyPassword } from '../utils/password.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';

/**
 * Fields returned for a signed-in user. `passwordHash` is never selected here,
 * which is what guarantees it can never leak through a response.
 */
const currentUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  createdAt: true,
  profile: {
    select: {
      phone: true,
      bio: true,
      city: true,
      occupation: true,
      education: true,
    },
  },
} as const;

/** Detects Prisma unique-constraint violations without importing its error class. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

/**
 * Creates a student or owner account.
 *
 * The email uniqueness check gives a friendly error, and the unique index on
 * `users.email` is the real guard for concurrent registrations.
 */
export async function registerUser(input: RegisterInput): Promise<CurrentUser> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    throw ApiError.conflict('An account with that email already exists', 'EMAIL_IN_USE');
  }

  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        profile: { create: {} },
      },
      select: currentUserSelect,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('An account with that email already exists', 'EMAIL_IN_USE');
    }

    throw error;
  }
}

/**
 * Verifies credentials.
 *
 * Missing accounts and wrong passwords return the same error so the endpoint
 * cannot be used to discover which email addresses are registered, and a dummy
 * hash comparison keeps the response time similar in both cases.
 */
export async function authenticateUser(input: LoginInput): Promise<CurrentUser> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { ...currentUserSelect, passwordHash: true },
  });

  if (!user) {
    await verifyPassword(input.password, TIMING_EQUALISATION_HASH);
    throw ApiError.unauthorized('Incorrect email or password', 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw ApiError.unauthorized('Incorrect email or password', 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw ApiError.forbidden(
      'This account has been suspended. Contact support for help.',
      'ACCOUNT_SUSPENDED',
    );
  }

  const { passwordHash: _passwordHash, ...currentUser } = user;

  return currentUser;
}

/** Loads the signed-in user for the `authenticate` middleware. */
export async function findCurrentUser(userId: string): Promise<CurrentUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: currentUserSelect,
  });
}
