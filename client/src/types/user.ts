/** User roles. Kept in sync with the server enum (Milestone 3/4). */
export const USER_ROLES = ['STUDENT', 'OWNER', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Public-safe user shape. Never carries a password hash. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
}

/** Profile fields a student/owner can edit (Milestone 5). */
export interface UserProfile {
  userId: string;
  phone: string | null;
  bio: string | null;
  city: string | null;
  occupation: string | null;
  education: string | null;
}
