/** Roles, kept in sync with the Prisma `Role` enum. */
export const USER_ROLES = ['STUDENT', 'OWNER', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Fields of a user that are safe to return to a client. */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface UserProfileSummary {
  phone: string | null;
  bio: string | null;
  city: string | null;
  occupation: string | null;
  education: string | null;
}

/**
 * The signed-in user attached to the request by the `authenticate` middleware.
 * Never contains `passwordHash`.
 */
export interface CurrentUser extends AuthenticatedUser {
  createdAt: Date;
  profile: UserProfileSummary | null;
}

/** Claims stored inside the access token. */
export interface AccessTokenPayload {
  /** User id. */
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
