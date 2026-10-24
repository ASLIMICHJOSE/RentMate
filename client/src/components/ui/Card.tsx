import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Renders plain padding-free markup when false. */
  padded?: boolean;
}

export function Card({ children, className, padded = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#e8e2d8] bg-white shadow-[0_4px_24px_rgba(20,26,36,0.04)] transition-all duration-300',
        padded && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Consistent heading row used at the top of cards. */
export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-[#f0ece4] pb-3 mb-4', className)}>
      <div>
        <h2 className="font-serif text-xl font-medium tracking-tight text-[#141a24]">{title}</h2>
        {description && <p className="mt-1 text-xs text-[#5e6676]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
