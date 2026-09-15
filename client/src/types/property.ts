/**
 * Domain types for properties.
 *
 * These mirror the Prisma models introduced in Milestone 3 so the UI can be
 * built against the real contract before the database exists.
 */

export const PROPERTY_TYPES = [
  'APARTMENT',
  'HOUSE',
  'PG',
  'HOSTEL',
  'STUDIO',
  'SHARED_ROOM',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_STATUSES = ['PENDING', 'PUBLISHED', 'REJECTED', 'RENTED', 'ARCHIVED'] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

/** Amenity codes. Labels live in `utils/labels.ts`. */
export const AMENITIES = [
  'WIFI',
  'PARKING',
  'LAUNDRY',
  'KITCHEN',
  'AC',
  'SECURITY',
  'POWER_BACKUP',
  'WATER_SUPPLY',
  'GYM',
  'MEALS',
] as const;

export type Amenity = (typeof AMENITIES)[number];

export interface PropertyImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

/** Minimal public owner info safe to expose on a listing. */
export interface PropertyOwner {
  id: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  memberSince: string;
  verified: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  /** Monthly rent, in INR. */
  rent: number;
  deposit: number;
  city: string;
  locality: string;
  address: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  areaSqft: number | null;
  /** ISO date string. */
  availableFrom: string;
  status: ListingStatus;
  amenities: Amenity[];
  images: PropertyImage[];
  owner: PropertyOwner;
  createdAt: string;
  updatedAt: string;
}

export const SORT_OPTIONS = ['newest', 'rent-asc', 'rent-desc'] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

/**
 * Search/filter state for property discovery.
 *
 * `''` means "no filter" so select inputs can stay controlled without
 * juggling nullable values. Milestone 7 serialises this into query params.
 */
export interface PropertyFilters {
  q: string;
  city: string;
  minRent: string;
  maxRent: string;
  propertyType: PropertyType | '';
  bedrooms: string;
  furnished: '' | 'true' | 'false';
  amenities: Amenity[];
  sort: SortOption;
}

export const EMPTY_PROPERTY_FILTERS: PropertyFilters = {
  q: '',
  city: '',
  minRent: '',
  maxRent: '',
  propertyType: '',
  bedrooms: '',
  furnished: '',
  amenities: [],
  sort: 'newest',
};
