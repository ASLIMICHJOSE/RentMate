import { ApiRequestError } from '../services/http';
import type { Property, PropertyFilters } from '../types/property';
import type { RoommateFilters, RoommateMatch } from '../types/roommate';
import { MOCK_PROPERTIES, filterMockProperties, findMockProperty } from './mockProperties';
import { MOCK_ROOMMATE_MATCHES } from './mockRoommates';

/**
 * MOCK API LAYER - Milestone 2 only.
 *
 * Deliberately async and deliberately shaped like the real thing: pages use the
 * same loading / ready / error flow they will use once `services/` calls
 * `GET /api/properties` (Milestone 7). Replacing this file is the whole point.
 */

const MOCK_LATENCY_MS = 300;

function afterLatency<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

export interface PropertyListResult {
  items: Property[];
  total: number;
}

/** Returns published listings matching the filters. */
export function fetchProperties(filters: PropertyFilters): Promise<PropertyListResult> {
  const published = MOCK_PROPERTIES.filter((property) => property.status === 'PUBLISHED');
  const items = filterMockProperties(published, filters);

  return afterLatency({ items, total: items.length });
}

/** Returns a single listing, rejecting with the API error shape when missing. */
export function fetchPropertyById(id: string): Promise<Property> {
  const property = findMockProperty(id);

  if (!property || property.status !== 'PUBLISHED') {
    return Promise.reject(
      new ApiRequestError(
        'That property does not exist or is no longer published.',
        'PROPERTY_NOT_FOUND',
        404,
      ),
    );
  }

  return afterLatency(property);
}

/** Returns roommate matches filtered by city, budget and gender preference. */
export function fetchRoommateMatches(filters: RoommateFilters): Promise<RoommateMatch[]> {
  const query = filters.q.trim().toLowerCase();
  const maxBudget = filters.budgetMax ? Number(filters.budgetMax) : null;

  const matches = MOCK_ROOMMATE_MATCHES.filter(({ profile }) => {
    if (query) {
      const haystack = `${profile.name} ${profile.city} ${profile.occupation} ${
        profile.institute ?? ''
      } ${profile.bio}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.city && profile.city !== filters.city) return false;

    // A match is relevant if the two budgets still overlap.
    if (maxBudget !== null && profile.budgetMin > maxBudget) return false;

    if (filters.genderPreference && profile.genderPreference !== filters.genderPreference) {
      return false;
    }

    return true;
  }).sort((a, b) => b.score - a.score);

  return afterLatency(matches);
}
