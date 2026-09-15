import { describe, expect, it } from 'vitest';
import { PASSWORD_SALT_ROUNDS, hashPassword, verifyPassword } from './password.js';

describe('password hashing', () => {
  it('never returns the plaintext and produces a bcrypt hash', async () => {
    const hash = await hashPassword('Password123!');

    expect(hash).not.toContain('Password123!');
    expect(hash).toMatch(/^\$2[aby]\$/);
    expect(hash).toHaveLength(60);
    expect(hash).toContain(`$${PASSWORD_SALT_ROUNDS}$`);
  });

  it('salts each hash so identical passwords differ', async () => {
    const [first, second] = await Promise.all([
      hashPassword('Password123!'),
      hashPassword('Password123!'),
    ]);

    expect(first).not.toBe(second);
  });

  it('verifies the correct password', async () => {
    const hash = await hashPassword('Password123!');

    await expect(verifyPassword('Password123!', hash)).resolves.toBe(true);
    await expect(verifyPassword('password123!', hash)).resolves.toBe(false);
    await expect(verifyPassword('', hash)).resolves.toBe(false);
  });
});
