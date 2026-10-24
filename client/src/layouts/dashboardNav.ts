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
  { label: 'Roommate profile', to: '/profile' },
];

export const OWNER_NAV: DashboardNavItem[] = [
  { label: 'Overview & Listings', to: '/owner' },
  { label: 'Messages', to: '/messages' },
  { label: 'Browse properties', to: '/properties' },
  { label: 'Profile settings', to: '/profile' },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  { label: 'Platform Overview', to: '/admin' },
  { label: 'Property Moderation', to: '/admin' },
  { label: 'User Accounts', to: '/admin' },
  { label: 'Safety Reports', to: '/admin' },
  { label: 'Messages', to: '/messages' },
  { label: 'Live Marketplace', to: '/properties' },
];

