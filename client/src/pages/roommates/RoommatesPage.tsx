import { useEffect, useMemo, useState } from 'react';
import { RoommateCard } from '../../components/roommate/RoommateCard';
import { SearchBar } from '../../components/property/SearchBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { FormField } from '../../components/ui/FormField';
import { LoadingState } from '../../components/ui/LoadingState';
import { PageHeader } from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/Select';
import { TextInput } from '../../components/ui/TextInput';
import { AppStore } from '../../services/store';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  EMPTY_ROOMMATE_FILTERS,
  GENDER_PREFERENCES,
  type RoommateFilters,
  type RoommateMatch,
  type SleepSchedule,
  type FoodPreference,
  type CleanlinessLevel,
} from '../../types/roommate';
import { GENDER_PREFERENCE_LABELS } from '../../utils/labels';

const GENDER_OPTIONS = GENDER_PREFERENCES.map((value) => ({
  value,
  label: GENDER_PREFERENCE_LABELS[value],
}));

export default function RoommatesPage() {
  const [filters, setFilters] = useState<RoommateFilters>(EMPTY_ROOMMATE_FILTERS);

  // Live Compatibility Preferences State
  const [mySleep, setMySleep] = useState<SleepSchedule>('EARLY_BIRD');
  const [myFood, setMyFood] = useState<FoodPreference>('VEGETARIAN');
  const [myCleanliness, setMyCleanliness] = useState<CleanlinessLevel>('TIDY');
  const [myBudgetMax, setMyBudgetMax] = useState<number>(15000);
  const [isTunerOpen, setIsTunerOpen] = useState(true);

  const debouncedQuery = useDebouncedValue(filters.q);

  // Dynamic Matches Calculation based on active preferences
  const matches = useMemo<RoommateMatch[]>(() => {
    const raw = AppStore.calculateRoommateMatches({
      sleepSchedule: mySleep,
      foodPreference: myFood,
      cleanliness: myCleanliness,
      budgetMax: myBudgetMax,
      city: filters.city || undefined,
    });

    const query = debouncedQuery.trim().toLowerCase();

    return raw.filter(({ profile }) => {
      if (query) {
        const haystack = `${profile.name} ${profile.city} ${profile.occupation} ${
          profile.institute ?? ''
        } ${profile.bio}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (filters.city && profile.city !== filters.city) return false;

      if (filters.budgetMax && profile.budgetMin > Number(filters.budgetMax)) {
        return false;
      }

      if (filters.genderPreference && profile.genderPreference !== filters.genderPreference) {
        return false;
      }

      return true;
    });
  }, [mySleep, myFood, myCleanliness, myBudgetMax, filters.city, filters.budgetMax, filters.genderPreference, debouncedQuery]);

  const cityOptions = useMemo(
    () => ['Chennai', 'Bengaluru', 'Pune', 'Hyderabad', 'Mumbai'].map((c) => ({ value: c, label: c })),
    [],
  );

  function updateFilters(patch: Partial<RoommateFilters>): void {
    setFilters((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Roommates"
        title="Find a flatmate who fits your life"
        description="Transparent, deterministic compatibility algorithm: tweak your lifestyle preferences below and watch scores update in real time."
      />

      {/* Interactive Compatibility Tuner Banner */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-xs font-bold">⚡</span>
              <h2 className="font-heading text-lg font-bold">Interactive Compatibility Matcher</h2>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Customize your daily routine & budget to instantly recalculate compatibility scores across all flatmates.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTunerOpen(!isTunerOpen)}
            className="text-white border-white/30 hover:bg-white/10"
          >
            {isTunerOpen ? 'Hide Preferences' : 'Adjust Preferences'}
          </Button>
        </div>

        {isTunerOpen && (
          <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                My Sleep Schedule
              </label>
              <select
                value={mySleep}
                onChange={(e) => setMySleep(e.target.value as SleepSchedule)}
                className="mt-1.5 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2 text-xs font-semibold text-white focus:outline-brand-400"
              >
                <option value="EARLY_BIRD">🌅 Early Bird (Sleeps 10 PM)</option>
                <option value="FLEXIBLE">⚖️ Flexible / Standard</option>
                <option value="NIGHT_OWL">🦉 Night Owl (Sleeps 2 AM)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                My Food Habit
              </label>
              <select
                value={myFood}
                onChange={(e) => setMyFood(e.target.value as FoodPreference)}
                className="mt-1.5 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2 text-xs font-semibold text-white focus:outline-brand-400"
              >
                <option value="VEGETARIAN">🥗 Pure Vegetarian</option>
                <option value="EGGETARIAN">🍳 Eggetarian</option>
                <option value="NON_VEGETARIAN">🍗 Non-Vegetarian</option>
                <option value="VEGAN">🌱 Vegan</option>
                <option value="NO_PREFERENCE">🍽️ No Preference</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Cleanliness Routine
              </label>
              <select
                value={myCleanliness}
                onChange={(e) => setMyCleanliness(e.target.value as CleanlinessLevel)}
                className="mt-1.5 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2 text-xs font-semibold text-white focus:outline-brand-400"
              >
                <option value="SPOTLESS">✨ Spotless & Organised</option>
                <option value="TIDY">🧼 Tidy & Clean Daily</option>
                <option value="AVERAGE">🧹 Average / Normal</option>
                <option value="RELAXED">🛋️ Relaxed & Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Max Monthly Budget (₹{myBudgetMax.toLocaleString()})
              </label>
              <input
                type="range"
                min="6000"
                max="30000"
                step="1000"
                value={myBudgetMax}
                onChange={(e) => setMyBudgetMax(Number(e.target.value))}
                className="mt-3 w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search & Location Filters */}
      <div className="mt-6">
        <SearchBar
          label="Search roommates"
          placeholder="Search by name, university (e.g. Anna University, IIT Madras), or locality..."
          value={filters.q}
          onChange={(value) => updateFilters({ q: value })}
        />
      </div>

      <Card className="mt-6 rounded-2xl border-slate-200/80 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="roommate-city" label="Filter City">
            {(field) => (
              <Select
                {...field}
                value={filters.city}
                onChange={(event) => updateFilters({ city: event.target.value })}
                options={[{ value: '', label: 'All Cities' }, ...cityOptions]}
              />
            )}
          </FormField>

          <FormField id="roommate-gender" label="Gender Preference">
            {(field) => (
              <Select
                {...field}
                value={filters.genderPreference}
                onChange={(event) => updateFilters({ genderPreference: event.target.value as any })}
                options={[{ value: '', label: 'Any Preference' }, ...GENDER_OPTIONS]}
              />
            )}
          </FormField>

          <FormField id="roommate-budget" label="Max Budget Limit">
            {(field) => (
              <TextInput
                {...field}
                type="number"
                placeholder="e.g. 15000"
                value={filters.budgetMax}
                onChange={(event) => updateFilters({ budgetMax: event.target.value })}
              />
            )}
          </FormField>
        </div>
      </Card>

      {/* Results Header */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Found <span className="font-extrabold text-brand-600">{matches.length}</span> compatible roommate matches
        </p>
        <span className="text-xs text-slate-500">Sorted by highest compatibility percentage</span>
      </div>

      {/* Roommates Grid */}
      {matches.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No matches found"
            message="Try widening your search terms, adjusting budget limits, or clearing city filters."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(EMPTY_ROOMMATE_FILTERS)}
              >
                Reset filters
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <li key={match.profile.id}>
              <RoommateCard match={match} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
