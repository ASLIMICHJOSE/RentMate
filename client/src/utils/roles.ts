import type { UserRole } from '../types/user';

export const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Student',
  OWNER: 'Owner',
  ADMIN: 'Admin',
};

/** Where each role lands after signing in. */
export function defaultRouteForRole(role: UserRole): string {
  switch (role) {
    case 'OWNER':
      return '/owner';
    case 'ADMIN':
      return '/admin';
    case 'STUDENT':
    default:
      return '/dashboard';
  }
}
