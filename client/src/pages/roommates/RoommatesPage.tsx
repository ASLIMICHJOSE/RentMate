import { useEffect, useMemo, useState } from 'react';
import { RoommateCard } from '../../components/roommate/RoommateCard';
import { SearchBar } from '../../components/property/SearchBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { FormField } from '../../components/ui/FormField';
import { LoadingState } from '../../components/ui/LoadingState';
import { PageHeader } from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/Select';
import { TextInput } from '../../components/ui/TextInput';
import { fetchRoommateMatches } from '../../data/mockApi';
import { getMockRoommateCityOptions } from '../../data/mockRoommates';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { ApiRequestError } from '../../services/http';
import {
  EMPTY_ROOMMATE_FILTERS,
  GENDER_PREFERENCES,
  type GenderPreference,
  type RoommateFilters,
  type RoommateMatch,
} from '../../types/roommate';
import { GENDER_PREFERENCE_LABELS } from '../../utils/labels';

const GENDER_OPTIONS = GENDER_PREFERENCES.map((value) => ({
  value,
  label: GENDER_PREFERENCE_LABELS[value],
}));

interface MatchesState {
  status: 'loading' | 'ready' | 'error';
  key: string;
  matches?: RoommateMatch[];
  error?: string;
  errorCode?: string;
}

export default function RoommatesPage() {
  const [filters, setFilters] = useState<RoommateFilters>(EMPTY_ROOMMATE_FILTERS);
  const [state, setState] = useState<MatchesState>({ status: 'loading', key: '' });
  const [attempt, setAttempt] = useState(0);

  const debouncedQuery = useDebouncedValue(filters.q);
  const effectiveFilters = useMemo<RoommateFilters>(
    () => ({ ...filters, q: debouncedQuery }),
    [filters, debouncedQuery],
  );
  const filterKey = useMemo(() => JSON.stringify(effectiveFilters), [effectiveFilters]);

  useEffect(() => {
    let ignore = false;

    fetchRoommateMatches(effectiveFilters)
      .then((matches) => {
        if (ignore) return;
        setState({ status: 'ready', key: filterKey, matches });
      })
      .catch((caught: unknown) => {
        if (ignore) return;
        setState({
          status: 'error',
          key: filterKey,
          error:
            caught instanceof ApiRequestError
              ? caught.message
              : 'We could not load roommate matches right now.',
          errorCode: caught instanceof ApiRequestError ? caught.code : undefined,
        });
      });

    return () => {
      ignore = true;
    };
  }, [effectiveFilters, filterKey, attempt]);

  const cityOptions = useMemo(
    () => getMockRoommateCityOptions().map((city) => ({ value: city, label: city })),
    [],
  );

  const isStale = state.key !== filterKey;
  const isLoading = isStale || state.status === 'loading';
  const isError = !isStale && state.status === 'error';
  const matches = isStale ? undefined : state.matches;

  function update(patch: Partial<RoommateFilters>): void {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function handleRetry(): void {
    setState({ status: 'loading', key: filterKey });
    setAttempt((current) => current + 1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Roommates"
        title="Find a flatmate who fits"
        description="Every match shows exactly how the compatibility score was calculated: budget, location, lifestyle, sleep, food and preferences."
      />

      <div className="mt-6">
        <SearchBar
          label="Search roommates"
          placeholder="Search by name, college or city"
          value={filters.q}
          onChange={(value) => update({ q: value })}
        />
      </div>

      <Card className="mt-6">
        <h2 className="text-base font-semibold text-slate-900">Refine your search</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField id="roommate-city" label="City">
            {(field) => (
              <Select
                {...field}
                value={filters.city}
                placeholder="Any city"
                options={cityOptions}
                onChange={(event) => update({ city: event.target.value })}
              />
            )}
          </FormField>

          <FormField id="roommate-budget" label="Maximum monthly budget (₹)">
            {(field) => (
              <TextInput
                {...field}
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                placeholder="e.g. 15000"
                value={filters.budgetMax}
                onChange={(event) => update({ budgetMax: event.target.value })}
              />
            )}
          </FormField>

          <FormField id="roommate-gender" label="Preferred flatmate">
            {(field) => (
              <Select
                {...field}
                value={filters.genderPreference}
                placeholder="Any preference"
                options={GENDER_OPTIONS}
                onChange={(event) =>
                  update({ genderPreference: event.target.value as GenderPreference | '' })
                }
              />
            )}
          </FormField>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setFilters(EMPTY_ROOMMATE_FILTERS)}
        >
          Clear filters
        </Button>
      </Card>

      <p className="mt-6 text-sm text-slate-600" aria-live="polite">
        {isLoading
          ? 'Finding matches…'
          : `${matches?.length ?? 0} ${matches?.length === 1 ? 'match' : 'matches'} found`}
      </p>

      <div className="mt-4">
        {isLoading && <LoadingState message="Scoring potential flatmates…" />}

        {isError && (
          <ErrorState
            title="Could not load matches"
            message={state.error ?? 'Please try again.'}
            code={state.errorCode}
            onRetry={handleRetry}
          />
        )}

        {!isLoading && !isError && matches && matches.length === 0 && (
          <EmptyState
            title="No roommates match yet"
            message="Adjust the city or raise your budget to see more students looking for a flatmate."
            action={
              <Button variant="outline" onClick={() => setFilters(EMPTY_ROOMMATE_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        )}

        {!isLoading && !isError && matches && matches.length > 0 && (
          <ul className="grid gap-6 lg:grid-cols-2">
            {matches.map((match) => (
              <li key={match.profile.id}>
                <RoommateCard match={match} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
