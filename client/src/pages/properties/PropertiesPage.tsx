import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from '../../components/property/FilterPanel';
import { PropertyCard } from '../../components/property/PropertyCard';
import { PropertyCardSkeleton } from '../../components/property/PropertyCardSkeleton';
import { SearchBar } from '../../components/property/SearchBar';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { PageHeader } from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/Select';
import { fetchProperties, type PropertyListResult } from '../../data/mockApi';
import { getMockCityOptions } from '../../data/mockProperties';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { ApiRequestError } from '../../services/http';
import {
  EMPTY_PROPERTY_FILTERS,
  SORT_OPTIONS,
  type PropertyFilters,
  type SortOption,
} from '../../types/property';
import { SORT_LABELS } from '../../utils/labels';

interface ResultState {
  status: 'loading' | 'ready' | 'error';
  /** Filter signature this state belongs to, used to detect stale results. */
  key: string;
  result?: PropertyListResult;
  error?: string;
  errorCode?: string;
}

const SORT_OPTION_LIST = SORT_OPTIONS.map((value) => ({ value, label: SORT_LABELS[value] }));

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Seed from the URL so links like /properties?q=guindy are shareable.
  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    ...EMPTY_PROPERTY_FILTERS,
    q: searchParams.get('q') ?? '',
    city: searchParams.get('city') ?? '',
  }));

  const [state, setState] = useState<ResultState>({ status: 'loading', key: '' });
  // Bumped by "Try again" to re-run the query even when the filters are unchanged.
  const [attempt, setAttempt] = useState(0);

  const debouncedQuery = useDebouncedValue(filters.q);
  const effectiveFilters = useMemo<PropertyFilters>(
    () => ({ ...filters, q: debouncedQuery }),
    [filters, debouncedQuery],
  );
  const filterKey = useMemo(() => JSON.stringify(effectiveFilters), [effectiveFilters]);

  useEffect(() => {
    let ignore = false;

    fetchProperties(effectiveFilters)
      .then((result) => {
        if (ignore) return;
        setState({ status: 'ready', key: filterKey, result });
      })
      .catch((caught: unknown) => {
        if (ignore) return;
        setState({
          status: 'error',
          key: filterKey,
          error:
            caught instanceof ApiRequestError
              ? caught.message
              : 'We could not load properties right now.',
          errorCode: caught instanceof ApiRequestError ? caught.code : undefined,
        });
      });

    return () => {
      ignore = true;
    };
  }, [effectiveFilters, filterKey, attempt]);

  // Keep the URL in step with the search term and city.
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQuery) next.set('q', debouncedQuery);
    if (filters.city) next.set('city', filters.city);
    setSearchParams(next, { replace: true });
  }, [debouncedQuery, filters.city, setSearchParams]);

  const isStale = state.key !== filterKey;
  const isLoading = isStale || state.status === 'loading';
  const isError = !isStale && state.status === 'error';
  const result = !isStale ? state.result : undefined;

  const cityOptions = useMemo(() => getMockCityOptions(), []);

  function handleRetry(): void {
    setState({ status: 'loading', key: filterKey });
    setAttempt((current) => current + 1);
  }

  const activeFilterCount = [
    filters.city,
    filters.minRent,
    filters.maxRent,
    filters.propertyType,
    filters.bedrooms,
    filters.furnished,
    filters.amenities.length > 0 ? 'amenities' : '',
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Discover"
        title="Find your next place"
        description="Search verified student rentals by city, budget, furnishing and amenities."
      />

      <div className="mt-6">
        <SearchBar
          value={filters.q}
          onChange={(value) => setFilters((current) => ({ ...current, q: value }))}
          onSubmit={(value) => setFilters((current) => ({ ...current, q: value }))}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_PROPERTY_FILTERS)}
          cityOptions={cityOptions}
        />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600" aria-live="polite">
              {isLoading
                ? 'Searching…'
                : `${result?.total ?? 0} ${result?.total === 1 ? 'property' : 'properties'} found`}
              {activeFilterCount > 0 && !isLoading && ` · ${activeFilterCount} filter(s) applied`}
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-results" className="text-sm text-slate-600">
                Sort by
              </label>
              <Select
                id="sort-results"
                className="w-auto"
                value={filters.sort}
                options={SORT_OPTION_LIST}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    sort: event.target.value as SortOption,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-5" aria-busy={isLoading}>
            {isLoading && (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <li key={index}>
                    <PropertyCardSkeleton />
                  </li>
                ))}
              </ul>
            )}

            {isError && (
              <ErrorState
                title="Could not load properties"
                message={state.error ?? 'Please try again.'}
                code={state.errorCode}
                onRetry={handleRetry}
              />
            )}

            {!isLoading && !isError && result && result.items.length === 0 && (
              <EmptyState
                title="No properties match those filters"
                message="Try widening your budget, removing an amenity or searching a nearby locality."
                action={
                  <Button variant="outline" onClick={() => setFilters(EMPTY_PROPERTY_FILTERS)}>
                    Clear filters
                  </Button>
                }
              />
            )}

            {!isLoading && !isError && result && result.items.length > 0 && (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((property) => (
                  <li key={property.id}>
                    <PropertyCard property={property} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="mt-8 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            Sample data is used until Milestone 7, when search and filtering move into the database
            query (with pagination) instead of running in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
