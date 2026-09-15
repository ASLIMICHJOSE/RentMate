import type { ApiSuccess } from '../types/api';
import type { CurrentUser } from '../types/user';
import { ApiRequestError, http } from './http';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'OWNER';
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** `POST /api/auth/register` - creates the account and starts a session. */
export async function registerAccount(payload: RegisterPayload): Promise<CurrentUser> {
  const response = await http.post<ApiSuccess<{ user: CurrentUser }>>('/auth/register', payload);
  return response.data.data.user;
}

/** `POST /api/auth/login` */
export async function loginAccount(payload: LoginPayload): Promise<CurrentUser> {
  const response = await http.post<ApiSuccess<{ user: CurrentUser }>>('/auth/login', payload);
  return response.data.data.user;
}

/** `POST /api/auth/logout` - clears the httpOnly session cookie. */
export async function logoutAccount(): Promise<void> {
  await http.post('/auth/logout');
}

/**
 * `GET /api/auth/me`
 *
 * Returns `null` for a signed-out visitor (401) and only throws for genuine
 * failures, so the app can restore a session on load without error noise.
 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await http.get<ApiSuccess<{ user: CurrentUser }>>('/auth/me');
    return response.data.data.user;
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}
