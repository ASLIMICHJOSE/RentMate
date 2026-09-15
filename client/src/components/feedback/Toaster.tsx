import type { Toast, ToastVariant } from '../../context/toastContext';
import { cn } from '../../utils/cn';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-white',
  error: 'border-red-200 bg-white',
  info: 'border-slate-200 bg-white',
};

const accentStyles: Record<ToastVariant, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-brand-500',
};

export interface ToasterProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

/** Fixed toast stack. The container is a polite live region for screen readers. */
export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg',
            variantStyles[toast.variant],
          )}
        >
          <span
            aria-hidden="true"
            className={cn('mt-1 size-2.5 shrink-0 rounded-full', accentStyles[toast.variant])}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-sm text-slate-600">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label={`Dismiss notification: ${toast.title}`}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
