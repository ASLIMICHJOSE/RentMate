import type { FormEvent } from 'react';
import { Button } from '../ui/Button';

export interface SearchBarProps {
  /** Current (immediate) search term. */
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Search field for discovery pages.
 *
 * Typing updates the parent immediately; the parent debounces before querying
 * (see `useDebouncedValue`) so requests are not sent per keystroke.
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  label = 'Search properties',
  placeholder = 'Try “Guindy”, “studio” or “furnished”',
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <label htmlFor="property-search" className="sr-only">
          {label}
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="m13.5 13.5 3 3"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          id="property-search"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
