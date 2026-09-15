import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user';
import { ROLE_LABELS, defaultRouteForRole } from '../../utils/roles';
import { LoadingState } from '../ui/LoadingState';
import { buttonStyles } from '../ui/buttonStyles';

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Roles allowed on this route. Any signed-in user when omitted. */
  roles?: UserRole[];
}

/** Shown when a signed-in user opens a page their role cannot access. */
function AccessDenied({ role }: { role: UserRole }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-wide text-red-600 uppercase">403</p>
      <h1 className="text-2xl font-bold text-slate-900">
        This area is not available for your role
      </h1>
      <p className="text-sm text-slate-600">
        You are signed in as a {ROLE_LABELS[role].toLowerCase()}. This page belongs to a different
        part of RentMate.
      </p>
      <Link to={defaultRouteForRole(role)} className={buttonStyles()}>
        Go to your dashboard
      </Link>
    </div>
  );
}

/**
 * Client-side guard.
 *
 * This is a usability layer only: every protected endpoint re-checks the session
 * and the role on the server, so hiding a page is never the security boundary.
 */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <LoadingState message="Checking your session…" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <AccessDenied role={user.role} />;
  }

  return <>{children}</>;
}
