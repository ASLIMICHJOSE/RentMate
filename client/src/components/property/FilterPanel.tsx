import { useState } from 'react';
import type { Amenity, PropertyFilters, PropertyType } from '../../types/property';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { FormField } from '../ui/FormField';
import { Select } from '../ui/Select';
import { TextInput } from '../ui/TextInput';
import { cn } from '../../utils/cn';
import {
  AMENITY_OPTIONS,
  BEDROOM_OPTIONS,
  FURNISHED_LABELS,
  PROPERTY_TYPE_OPTIONS,
} from '../../utils/labels';

const FURNISHED_OPTIONS = [
  { value: 'true', label: FURNISHED_LABELS.true },
  { value: 'false', label: FURNISHED_LABELS.false },
];

export interface FilterPanelProps {
  filters: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onReset: () => void;
  cityOptions: string[];
}

/**
 * Property filters.
 *
 * Milestone 2 applies these to mock data in memory; Milestone 7 serialises the
 * same state into `/api/properties` query parameters.
 */
export function FilterPanel({ filters, onChange, onReset, cityOptions }: FilterPanelProps) {
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);

  function update(patch: Partial<PropertyFilters>): void {
    onChange({ ...filters, ...patch });
  }

  function toggleAmenity(amenity: Amenity): void {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((item) => item !== amenity)
      : [...filters.amenities, amenity];

    update({ amenities });
  }

  const citySelectOptions = cityOptions.map((city) => ({ value: city, label: city }));

  return (
    <Card className="lg:sticky lg:top-20">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 lg:hidden"
          aria-expanded={isOpenOnMobile}
          aria-controls="property-filter-fields"
          onClick={() => setIsOpenOnMobile((open) => !open)}
        >
          {isOpenOnMobile ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        id="property-filter-fields"
        className={cn('mt-4 flex-col gap-5', isOpenOnMobile ? 'flex' : 'hidden lg:flex')}
      >
        <FormField id="filter-city" label="City">
          {(field) => (
            <Select
              {...field}
              value={filters.city}
              placeholder="Any city"
              options={citySelectOptions}
              onChange={(event) => update({ city: event.target.value })}
            />
          )}
        </FormField>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">Monthly rent (₹)</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-min-rent" className="sr-only">
                Minimum rent
              </label>
              <TextInput
                id="filter-min-rent"
                type="number"
                min={0}
                step={500}
                inputMode="numeric"
                placeholder="Min"
                value={filters.minRent}
                onChange={(event) => update({ minRent: event.target.value })}
              />
            </div>
            <div>
              <label htmlFor="filter-max-rent" className="sr-only">
                Maximum rent
              </label>
              <TextInput
                id="filter-max-rent"
                type="number"
                min={0}
                step={500}
                inputMode="numeric"
                placeholder="Max"
                value={filters.maxRent}
                onChange={(event) => update({ maxRent: event.target.value })}
              />
            </div>
          </div>
        </fieldset>

        <FormField id="filter-type" label="Property type">
          {(field) => (
            <Select
              {...field}
              value={filters.propertyType}
              placeholder="Any type"
              options={PROPERTY_TYPE_OPTIONS}
              onChange={(event) =>
                update({ propertyType: event.target.value as PropertyType | '' })
              }
            />
          )}
        </FormField>

        <FormField id="filter-bedrooms" label="Bedrooms">
          {(field) => (
            <Select
              {...field}
              value={filters.bedrooms}
              placeholder="Any"
              options={BEDROOM_OPTIONS}
              onChange={(event) => update({ bedrooms: event.target.value })}
            />
          )}
        </FormField>

        <FormField id="filter-furnished" label="Furnishing">
          {(field) => (
            <Select
              {...field}
              value={filters.furnished}
              placeholder={FURNISHED_LABELS['']}
              options={FURNISHED_OPTIONS}
              onChange={(event) =>
                update({ furnished: event.target.value as PropertyFilters['furnished'] })
              }
            />
          )}
        </FormField>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">Amenities</legend>
          <div className="mt-2 flex flex-col gap-2">
            {AMENITY_OPTIONS.map((amenity) => (
              <Checkbox
                key={amenity.value}
                id={`amenity-${amenity.value}`}
                label={amenity.label}
                checked={filters.amenities.includes(amenity.value)}
                onChange={() => toggleAmenity(amenity.value)}
              />
            ))}
          </div>
        </fieldset>

        <Button variant="outline" size="sm" onClick={onReset} className="w-full">
          Clear all filters
        </Button>
      </div>
    </Card>
  );
}
