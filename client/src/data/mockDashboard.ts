/**
 * MOCK DATA - Milestone 2 only.
 *
 * Dashboard metrics become real aggregate queries in Milestones 13-18
 * (`/api/users/me/stats`, `/api/owner/stats`, `/api/admin/stats`).
 */

export interface StatCardData {
  label: string;
  value: number | string;
  hint: string;
}

export const MOCK_STUDENT_STATS: StatCardData[] = [
  { label: 'Saved properties', value: 2, hint: '1 new match in Guindy' },
  { label: 'Roommate matches', value: 6, hint: 'Top match 92% compatible' },
  { label: 'Pending requests', value: 3, hint: '2 roommate, 1 visit' },
  { label: 'Upcoming visits', value: 1, hint: 'Sat, 20 Sep at 11:00' },
  { label: 'Unread messages', value: 4, hint: 'From 2 conversations' },
];

export const MOCK_OWNER_STATS: StatCardData[] = [
  { label: 'My properties', value: 3, hint: 'Across 2 cities' },
  { label: 'Active listings', value: 2, hint: '1 pending moderation' },
  { label: 'Pending visits', value: 4, hint: '2 waiting more than a day' },
  { label: 'Unread messages', value: 7, hint: 'From 3 students' },
  { label: 'Average rating', value: '4.6', hint: 'From 11 reviews' },
];

export const MOCK_ADMIN_STATS: StatCardData[] = [
  { label: 'Total users', value: 428, hint: '+18 this week' },
  { label: 'Students', value: 361, hint: '84% of accounts' },
  { label: 'Owners', value: 67, hint: '4 awaiting verification' },
  { label: 'Total properties', value: 152, hint: 'Across 9 cities' },
  { label: 'Published', value: 128, hint: '84% of listings' },
  { label: 'Pending review', value: 14, hint: 'Oldest 2 days' },
  { label: 'Open reports', value: 6, hint: '2 marked urgent' },
  { label: 'Active listings', value: 121, hint: 'Rented: 7' },
];

export interface MockActivity {
  id: string;
  title: string;
  meta: string;
  /** ISO timestamp. */
  at: string;
}

export const MOCK_STUDENT_ACTIVITY: MockActivity[] = [
  {
    id: 'act-1',
    title: 'Priya Raghavan accepted your visit request',
    meta: 'Sunlit 2BHK near Anna University',
    at: '2026-09-15T06:30:00.000Z',
  },
  {
    id: 'act-2',
    title: 'New roommate match: Aditya Sharma',
    meta: '92% compatible · Guindy',
    at: '2026-09-14T15:05:00.000Z',
  },
  {
    id: 'act-3',
    title: 'You saved a property',
    meta: 'Modern studio with rooftop access',
    at: '2026-09-13T11:20:00.000Z',
  },
  {
    id: 'act-4',
    title: 'Roommate request sent to Meera Nair',
    meta: 'Awaiting response',
    at: '2026-09-12T09:00:00.000Z',
  },
];

export const MOCK_OWNER_ACTIVITY: MockActivity[] = [
  {
    id: 'oact-1',
    title: 'New visit request for Single room in a friendly 3BHK flat',
    meta: 'Requested slot: 20 Sep, 11:00',
    at: '2026-09-15T08:10:00.000Z',
  },
  {
    id: 'oact-2',
    title: 'Bright 1BHK on Anna Salai is pending review',
    meta: 'Submitted for moderation',
    at: '2026-09-13T17:10:00.000Z',
  },
  {
    id: 'oact-3',
    title: 'New 5-star review received',
    meta: '“Responded within an hour, flat was exactly as listed.”',
    at: '2026-09-11T13:45:00.000Z',
  },
];

export const MOCK_ADMIN_ACTIVITY: MockActivity[] = [
  {
    id: 'aact-1',
    title: 'Listing reported for misleading photos',
    meta: 'Bright 1BHK on Anna Salai',
    at: '2026-09-15T09:40:00.000Z',
  },
  {
    id: 'aact-2',
    title: 'Owner verification submitted',
    meta: 'Vikram Menon · Bengaluru',
    at: '2026-09-14T18:15:00.000Z',
  },
  {
    id: 'aact-3',
    title: 'User account suspended',
    meta: 'Repeated no-shows for scheduled visits',
    at: '2026-09-13T10:05:00.000Z',
  },
];
