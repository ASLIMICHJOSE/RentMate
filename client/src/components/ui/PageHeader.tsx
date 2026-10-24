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
    <div className={cn('flex flex-wrap items-end justify-between gap-4 border-b border-[#e8e2d8] pb-5 mb-8', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-[#c8643c] uppercase mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#141a24]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-[#5e6676] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
