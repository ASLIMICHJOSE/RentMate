import {
  AMENITIES,
  PROPERTY_TYPES,
  type Amenity,
  type ListingStatus,
  type PropertyType,
} from '../types/property';
import type {
  CleanlinessLevel,
  FoodPreference,
  GenderPreference,
  SleepSchedule,
  SmokingPreference,
} from '../types/roommate';

/** Human-readable labels for enum codes used across the UI. */

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  PG: 'Paying guest (PG)',
  HOSTEL: 'Hostel',
  STUDIO: 'Studio',
  SHARED_ROOM: 'Shared room',
};

export const PROPERTY_TYPE_OPTIONS = PROPERTY_TYPES.map((value) => ({
  value,
  label: PROPERTY_TYPE_LABELS[value],
}));

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  PENDING: 'Pending review',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  RENTED: 'Rented',
  ARCHIVED: 'Archived',
};

export const AMENITY_LABELS: Record<Amenity, string> = {
  WIFI: 'Wi-Fi',
  PARKING: 'Parking',
  LAUNDRY: 'Laundry',
  KITCHEN: 'Kitchen',
  AC: 'Air conditioning',
  SECURITY: 'Security',
  POWER_BACKUP: 'Power backup',
  WATER_SUPPLY: 'Water supply',
  GYM: 'Gym',
  MEALS: 'Meals included',
};

export const AMENITY_OPTIONS = AMENITIES.map((value) => ({
  value,
  label: AMENITY_LABELS[value],
}));

export const SORT_LABELS = {
  newest: 'Newest first',
  'rent-asc': 'Rent: low to high',
  'rent-desc': 'Rent: high to low',
} as const;

export const FURNISHED_LABELS = {
  '': 'Any furnishing',
  true: 'Furnished',
  false: 'Unfurnished',
} as const;

export const GENDER_PREFERENCE_LABELS: Record<GenderPreference, string> = {
  ANY: 'Any gender',
  MALE: 'Male',
  FEMALE: 'Female',
};

export const SLEEP_SCHEDULE_LABELS: Record<SleepSchedule, string> = {
  EARLY_BIRD: 'Early bird',
  FLEXIBLE: 'Flexible',
  NIGHT_OWL: 'Night owl',
};

export const FOOD_PREFERENCE_LABELS: Record<FoodPreference, string> = {
  VEGETARIAN: 'Vegetarian',
  EGGETARIAN: 'Eggetarian',
  NON_VEGETARIAN: 'Non-vegetarian',
  VEGAN: 'Vegan',
  NO_PREFERENCE: 'No preference',
};

export const SMOKING_LABELS: Record<SmokingPreference, string> = {
  NEVER: 'Never smokes',
  SOMETIMES: 'Smokes occasionally',
  REGULARLY: 'Smokes regularly',
};

export const CLEANLINESS_LABELS: Record<CleanlinessLevel, string> = {
  RELAXED: 'Relaxed',
  AVERAGE: 'Average',
  TIDY: 'Tidy',
  SPOTLESS: 'Spotless',
};

export const BEDROOM_OPTIONS = [
  { value: '1', label: '1 bedroom' },
  { value: '2', label: '2 bedrooms' },
  { value: '3', label: '3 bedrooms' },
  { value: '4', label: '4+ bedrooms' },
];
