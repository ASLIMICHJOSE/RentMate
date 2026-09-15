import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, className, id, ...rest },
  ref,
) {
  const hintId = hint && id ? `${id}-hint` : undefined;

  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
        aria-describedby={hintId}
        {...rest}
      />
      <label htmlFor={id} className="text-sm text-slate-700 select-none">
        {label}
        {hint && (
          <span id={hintId} className="block text-xs text-slate-500">
            {hint}
          </span>
        )}
      </label>
    </div>
  );
});
