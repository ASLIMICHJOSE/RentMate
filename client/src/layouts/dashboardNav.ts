import type { DashboardNavItem } from './DashboardLayout';

/**
 * Sidebar navigation per role.
 *
 * Items without `to` are not built yet and render disabled with the milestone
 * that delivers them, so navigation never points at a missing route.
 */
export const STUDENT_NAV: DashboardNavItem[] = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Saved properties', to: '/saved' },
  { label: 'Requests', to: '/requests' },
  { label: 'Messages', to: '/messages' },
  { label: 'Browse properties', to: '/properties' },
  { label: 'Find roommates', to: '/roommates' },
  { label: 'Roommate profile', unavailableReason: 'Roommate preferences arrive in Milestone 10' },
];

export const OWNER_NAV: DashboardNavItem[] = [
  { label: 'Overview', to: '/owner' },
  { label: 'My properties', unavailableReason: 'Property management arrives in Milestone 6' },
  { label: 'Add property', unavailableReason: 'Listing creation arrives in Milestone 6' },
  { label: 'Visit requests', unavailableReason: 'Visit scheduling arrives in Milestone 13' },
  { label: 'Messages', to: '/messages' },
  { label: 'Reviews', unavailableReason: 'Reviews arrive in Milestone 16' },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  { label: 'Overview', to: '/admin' },
  { label: 'Users', unavailableReason: 'User management arrives in Milestone 18' },
  { label: 'Properties', unavailableReason: 'Listing moderation arrives in Milestone 18' },
  { label: 'Reports', unavailableReason: 'Report handling arrives in Milestone 17' },
  { label: 'Analytics', unavailableReason: 'Platform statistics arrive in Milestone 18' },
];
