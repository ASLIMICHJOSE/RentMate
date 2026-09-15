import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  fetchCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  type LoginPayload,
  type RegisterPayload,
} from '../services/auth.service';
import type { CurrentUser } from '../types/user';
import { AuthContext, type AuthStatus } from './authContext';

/**
 * Owns the session for the whole app.
 *
 * The session lives in an httpOnly cookie, so it cannot be read from
 * JavaScript: on load the app asks `GET /api/auth/me` who is signed in.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let ignore = false;

    fetchCurrentUser()
      .then((current) => {
        if (ignore) return;
        setUser(current);
        setStatus(current ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (ignore) return;
        setUser(null);
        setStatus('anonymous');
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const current = await loginAccount(payload);
    setUser(current);
    setStatus('authenticated');
    return current;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const current = await registerAccount(payload);
    setUser(current);
    setStatus('authenticated');
    return current;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAccount();
    } finally {
      // Even if the request fails, the local session must be cleared so the UI
      // cannot keep showing an authenticated state.
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
