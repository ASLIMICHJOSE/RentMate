import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

const controlStyles =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50 aria-invalid:border-red-400 aria-invalid:ring-red-100';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn(controlStyles, className)} {...rest} />;
});
