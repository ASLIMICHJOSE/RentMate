/**
 * Minimal classname helper.
 *
 * Filters out falsey values so conditional classes stay readable without
 * pulling in an extra dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
