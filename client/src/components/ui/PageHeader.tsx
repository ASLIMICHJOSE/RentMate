import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Small label above the title (e.g. section or role context). */
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
