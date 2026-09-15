/**
 * Roommate domain types.
 *
 * The compatibility algorithm and request workflow arrive in Milestones 11
 * and 12; the shapes are defined now so mock UI can be built against them.
 */

export const GENDER_PREFERENCES = ['ANY', 'MALE', 'FEMALE'] as const;
export type GenderPreference = (typeof GENDER_PREFERENCES)[number];

export const SLEEP_SCHEDULES = ['EARLY_BIRD', 'FLEXIBLE', 'NIGHT_OWL'] as const;
export type SleepSchedule = (typeof SLEEP_SCHEDULES)[number];

export const FOOD_PREFERENCES = [
  'VEGETARIAN',
  'EGGETARIAN',
  'NON_VEGETARIAN',
  'VEGAN',
  'NO_PREFERENCE',
] as const;
export type FoodPreference = (typeof FOOD_PREFERENCES)[number];

export const SMOKING_PREFERENCES = ['NEVER', 'SOMETIMES', 'REGULARLY'] as const;
export type SmokingPreference = (typeof SMOKING_PREFERENCES)[number];

export const CLEANLINESS_LEVELS = ['RELAXED', 'AVERAGE', 'TIDY', 'SPOTLESS'] as const;
export type CleanlinessLevel = (typeof CLEANLINESS_LEVELS)[number];

export interface RoommateProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  city: string;
  budgetMin: number;
  budgetMax: number;
  preferredLocalities: string[];
  occupation: string;
  institute: string | null;
  /** ISO date string. */
  moveInFrom: string;
  foodPreference: FoodPreference;
  smoking: SmokingPreference;
  petsFriendly: boolean;
  sleepSchedule: SleepSchedule;
  cleanliness: CleanlinessLevel;
  /** Free-form description of study/work routine, kept short. */
  studyHabits: string;
  genderPreference: GenderPreference;
  bio: string;
}

/** How well one compatibility factor matched, used for explainable scores. */
export type FactorMatch = 'FULL' | 'PARTIAL' | 'NONE';

export interface CompatibilityFactor {
  label: string;
  /** 0-100 for this factor alone. */
  score: number;
  match: FactorMatch;
}

export interface RoommateMatch {
  profile: RoommateProfile;
  /** Weighted 0-100 compatibility score (Milestone 11 calculates this). */
  score: number;
  factors: CompatibilityFactor[];
}

export interface RoommateFilters {
  q: string;
  city: string;
  budgetMax: string;
  genderPreference: GenderPreference | '';
}

export const EMPTY_ROOMMATE_FILTERS: RoommateFilters = {
  q: '',
  city: '',
  budgetMax: '',
  genderPreference: '',
};
