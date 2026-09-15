import { describe, expect, it } from 'vitest';
import { loginSchema, passwordSchema, registerSchema } from './auth.validator.js';

describe('passwordSchema', () => {
  it('accepts a password with a letter and a number', () => {
    expect(passwordSchema.safeParse('Password123').success).toBe(true);
  });

  it.each([
    ['short1', 'at least 8 characters'],
    ['passwordonly', 'at least one number'],
    ['12345678', 'at least one letter'],
  ])('rejects %s', (value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false);
  });

  it('rejects passwords beyond the bcrypt input limit', () => {
    expect(passwordSchema.safeParse(`a1${'x'.repeat(80)}`).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validInput = {
    name: 'Aditya Sharma',
    email: 'Aditya.Sharma@Example.com',
    password: 'Password123',
    role: 'STUDENT',
  };

  it('normalises the email to lowercase and trims the name', () => {
    const result = registerSchema.parse({ ...validInput, name: '  Aditya Sharma  ' });

    expect(result.email).toBe('aditya.sharma@example.com');
    expect(result.name).toBe('Aditya Sharma');
  });

  it('never accepts a self-registered admin account', () => {
    expect(registerSchema.safeParse({ ...validInput, role: 'ADMIN' }).success).toBe(false);
  });

  it('accepts owner registrations', () => {
    expect(registerSchema.safeParse({ ...validInput, role: 'OWNER' }).success).toBe(true);
  });

  it('rejects missing or malformed fields', () => {
    expect(registerSchema.safeParse({ ...validInput, email: 'not-an-email' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validInput, name: 'A' }).success).toBe(false);
    expect(registerSchema.safeParse({ email: validInput.email }).success).toBe(false);
  });

  it('strips unknown fields so they cannot reach the database', () => {
    const result = registerSchema.parse({ ...validInput, isActive: true, role2: 'ADMIN' });

    expect(result).not.toHaveProperty('isActive');
    expect(result).not.toHaveProperty('role2');
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials and normalises the email', () => {
    const result = loginSchema.parse({ email: '  USER@Example.com ', password: 'Password123' });

    expect(result.email).toBe('user@example.com');
  });

  it('requires a password', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: '' }).success).toBe(false);
  });
});
