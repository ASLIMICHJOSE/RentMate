import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { buttonStyles } from '../ui/buttonStyles';
import { cn } from '../../utils/cn';

const primaryLinks = [
  { to: '/properties', label: 'Properties' },
  { to: '/roommates', label: 'Roommates' },
];

const secondaryLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
];

/**
 * Site header.
 *
 * Role-aware navigation ("Owner dashboard" / "Admin" links and a signed-in user
 * menu) is added in Milestone 4 once authentication exists; for now it always
 * offers sign in / sign up, which are real routes.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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

          <div className="hidden items-center gap-1 md:flex">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
            {secondaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
              Log in
            </Link>
            <Link to="/register" className={buttonStyles({ size: 'sm' })}>
              Sign up
            </Link>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
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
          <div id="mobile-menu" className="border-t border-slate-200 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {[...primaryLinks, ...secondaryLinks].map((link) => (
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
            </div>
            <div className="mt-3 flex gap-2">
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
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
