import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

/** ARIA props applied to the control rendered inside a `FormField`. */
export interface FieldControlProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
  'aria-required': boolean;
}

export interface FormFieldProps {
  /** Id of the control; also used for the label and description ids. */
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  /** Render prop so the control receives the correct ARIA wiring. */
  children: (fieldProps: FieldControlProps) => ReactNode;
}

/**
 * Accessible field wrapper: one label per control, errors announced politely
 * and hints linked through `aria-describedby`.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        'aria-required': required,
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
