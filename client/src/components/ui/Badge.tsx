import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-[#f5f0e8] text-[#5e6676] border border-[#e8e2d8]',
  brand: 'bg-[#fbf2ec] text-[#c8643c] border border-[#f3ddd0]',
  success: 'bg-[#eff5f1] text-[#2a5745] border border-[#d2e4d9]',
  warning: 'bg-[#fcf8ec] text-[#a17627] border border-[#f4e8c7]',
  danger: 'bg-[#fdf2f2] text-rose-700 border border-rose-200',
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
