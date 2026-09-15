import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Shown when a list or panel legitimately has no results. */
export function EmptyState({ title, message, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center',
        className,
      )}
    >
      {icon && <div className="text-3xl text-slate-400">{icon}</div>}
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="max-w-md text-sm text-slate-600">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
