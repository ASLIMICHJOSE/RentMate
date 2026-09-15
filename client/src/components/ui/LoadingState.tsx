import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

/** Centred loading indicator used while a page or panel is fetching data. */
export function LoadingState({ message = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-slate-500',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner className="size-6 text-brand-600" label={null} />
      <p className="text-sm">{message}</p>
    </div>
  );
}
