import { compare, hash } from 'bcryptjs';

/** Cost factor: high enough to be slow for attackers, fast enough for logins. */
export const PASSWORD_SALT_ROUNDS = 12;

/**
 * A valid bcrypt hash used to equalise timing when an email does not exist, so
 * attackers cannot tell registered addresses apart by response time.
 * Corresponds to a random throwaway password that is never used anywhere.
 */
export const TIMING_EQUALISATION_HASH =
  '$2b$12$fBap7e9ksfhlaNpyQlF.g.k3BRDLFVp9b4zlWqbyGBJjaeefB99RG';

/** Hashes a plaintext password. Plaintext is never stored or logged. */
export async function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, PASSWORD_SALT_ROUNDS);
}

/** Constant-time comparison of a plaintext password against a stored hash. */
export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(plainPassword, passwordHash);
}
