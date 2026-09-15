import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Toaster } from '../components/feedback/Toaster';
import { ToastContext, type Toast, type ToastInput } from './toastContext';

const AUTO_DISMISS_MS: Record<Toast['variant'], number> = {
  success: 5_000,
  info: 5_000,
  error: 8_000,
};

function createToastId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Owns toast state and exposes it through `useToast()`. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ variant = 'info', ...rest }: ToastInput) => {
      const id = createToastId();
      setToasts((current) => [...current, { id, variant, ...rest }]);

      timers.current.set(
        id,
        setTimeout(() => dismissToast(id), AUTO_DISMISS_MS[variant]),
      );
    },
    [dismissToast],
  );

  // Clear pending timers if the provider unmounts.
  useEffect(() => {
    const pending = timers.current;

    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
