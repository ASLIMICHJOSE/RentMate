import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { UserRole } from '../../types/user';
import { cn } from '../../utils/cn';
import { ROLE_LABELS } from '../../utils/roles';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { buttonStyles } from '../ui/buttonStyles';

interface NavLinkItem {
  to: string;
  label: string;
}

const publicLinks: NavLinkItem[] = [
  { to: '/properties', label: 'Properties' },
  { to: '/roommates', label: 'Roommates' },
];

/** Role-specific destinations. The server enforces the same rules. */
const roleLinks: Record<UserRole, NavLinkItem[]> = {
  STUDENT: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/saved', label: 'Saved' },
    { to: '/requests', label: 'Requests' },
    { to: '/messages', label: 'Messages' },
  ],
  OWNER: [
    { to: '/owner', label: 'My listings' },
    { to: '/messages', label: 'Messages' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Admin' },
    { to: '/messages', label: 'Messages' },
  ],
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const links = user ? [...publicLinks, ...roleLinks[user.role]] : publicLinks;
  const closeMenu = () => setIsMenuOpen(false);

  async function handleSignOut(): Promise<void> {
    closeMenu();
    await logout();
    showToast({ variant: 'success', title: 'Signed out', description: 'See you next time.' });
    navigate('/');
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 rounded-md">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M4 12.5 12 5l8 7.5V20a1 1 0 0 1-1 1h-5v-5.5H10V21H5a1 1 0 0 1-1-1v-7.5Z" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">RentMate</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {status === 'loading' && (
              <span className="text-sm text-slate-400">Checking session…</span>
            )}

            {status === 'anonymous' && (
              <>
                <Link to="/login" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  Log in
                </Link>
                <Link to="/register" className={buttonStyles({ size: 'sm' })}>
                  Sign up
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700"
                  >
                    {user.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? '')
                      .join('')}
                  </span>
                  <span className="max-w-32 truncate text-sm font-medium text-slate-800">
                    {user.name}
                  </span>
                  <Badge tone={user.role === 'ADMIN' ? 'danger' : 'brand'}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </Link>
                <Button variant="outline" size="sm" onClick={() => void handleSignOut()}>
                  Sign out
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
              {isMenuOpen ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-slate-200 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user && (
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                    )
                  }
                >
                  Profile
                </NavLink>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {status === 'anonymous' && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={buttonStyles({ variant: 'outline', size: 'sm', fullWidth: true })}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className={buttonStyles({ size: 'sm', fullWidth: true })}
                  >
                    Sign up
                  </Link>
                </>
              )}

              {user && (
                <>
                  <p className="px-1 text-sm text-slate-600">
                    Signed in as <span className="font-medium text-slate-900">{user.name}</span> (
                    {ROLE_LABELS[user.role]})
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => void handleSignOut()}
                  >
                    Sign out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
