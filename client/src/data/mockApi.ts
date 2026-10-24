import { ApiRequestError } from '../services/http';
import { AppStore } from '../services/store';
import type { Property, PropertyFilters } from '../types/property';
import type { RoommateFilters, RoommateMatch } from '../types/roommate';
import { filterMockProperties } from './mockProperties';

const MOCK_LATENCY_MS = 150;

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
  const published = AppStore.getProperties().filter((property) => property.status === 'PUBLISHED');
  const items = filterMockProperties(published, filters);

  return afterLatency({ items, total: items.length });
}

/** Returns a single listing, rejecting with the API error shape when missing. */
export function fetchPropertyById(id: string): Promise<Property> {
  const property = AppStore.getPropertyById(id);

  if (!property || (property.status !== 'PUBLISHED' && property.status !== 'RENTED')) {
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

/** Returns roommate matches filtered by city, budget and gender preference using dynamic compatibility scoring. */
export function fetchRoommateMatches(filters: RoommateFilters): Promise<RoommateMatch[]> {
  const query = filters.q.trim().toLowerCase();
  const maxBudget = filters.budgetMax ? Number(filters.budgetMax) : null;

  const matches = AppStore.calculateRoommateMatches({
    city: filters.city || undefined,
    budgetMax: maxBudget || 20000,
  }).filter(({ profile }) => {
    if (query) {
      const haystack = `${profile.name} ${profile.city} ${profile.occupation} ${
        profile.institute ?? ''
      } ${profile.bio}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.city && profile.city !== filters.city) return false;

    if (maxBudget !== null && profile.budgetMin > maxBudget) return false;

    if (filters.genderPreference && profile.genderPreference !== filters.genderPreference) {
      return false;
    }

    return true;
  });

  return afterLatency(matches);
}

