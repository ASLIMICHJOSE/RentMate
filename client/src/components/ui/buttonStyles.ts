import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl font-sans font-semibold transition-all duration-200 cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#c8643c] text-white hover:bg-[#a84c27] shadow-[0_4px_14px_rgba(200,100,60,0.25)] hover:shadow-[0_6px_20px_rgba(200,100,60,0.35)] focus-visible:outline-[#c8643c]',
  secondary:
    'bg-[#141a24] text-white hover:bg-[#232c3d] shadow-[0_4px_14px_rgba(20,26,36,0.15)] focus-visible:outline-[#141a24]',
  outline:
    'bg-white text-[#141a24] border border-[#e8e2d8] hover:bg-[#f7f4ee] hover:border-[#c8643c]/40 focus-visible:outline-[#c8643c]',
  ghost:
    'bg-transparent text-[#141a24] hover:bg-[#f5f0e8] focus-visible:outline-[#c8643c]',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wide',
  md: 'px-4 py-2 text-sm tracking-normal',
  lg: 'px-6 py-3 text-base tracking-normal',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && 'w-full', className);
}
