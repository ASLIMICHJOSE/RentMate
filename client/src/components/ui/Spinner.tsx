import { cn } from '../../utils/cn';

export interface SpinnerProps {
  className?: string;
  /** Screen-reader label; pass `null` for purely decorative spinners. */
  label?: string | null;
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      role={label ? 'status' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    />
  );
}
