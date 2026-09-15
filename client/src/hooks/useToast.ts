import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from '../context/toastContext';

/** Access the toast queue. Must be used inside `<ToastProvider>`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
