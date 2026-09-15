import { createContext } from 'react';
import type { LoginPayload, RegisterPayload } from '../services/auth.service';
import type { CurrentUser } from '../types/user';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  user: CurrentUser | null;
  status: AuthStatus;
  /** Signs in and stores the session cookie. */
  login: (payload: LoginPayload) => Promise<CurrentUser>;
  /** Registers a student or owner and starts a session. */
  register: (payload: RegisterPayload) => Promise<CurrentUser>;
  /** Clears the session on the server and locally. */
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
