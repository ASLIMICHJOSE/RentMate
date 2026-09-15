import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export type ToastInput = Omit<Toast, 'id' | 'variant'> & { variant?: ToastVariant };

export interface ToastContextValue {
  /** Adds a toast; it is dismissed automatically after a few seconds. */
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
