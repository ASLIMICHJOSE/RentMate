import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

/** Inline error panel. Uses `role="alert"` so screen readers announce failures. */
export function ErrorState({
  title = 'Something went wrong',
  message,
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-red-200 bg-red-50 p-6 text-left sm:text-center',
        className,
      )}
    >
      <h2 className="text-base font-semibold text-red-900">{title}</h2>
      <p className="mt-1 text-sm text-red-800">{message}</p>
      {code && <p className="mt-2 text-xs font-mono text-red-700/80">Error code: {code}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
