import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { UserRole } from '../../types/user';
import { cn } from '../../utils/cn';
import { ROLE_LABELS } from '../../utils/roles';
import { Badge } from '../ui/Badge';

interface NavLinkItem {
  to: string;
  label: string;
}

const publicLinks: NavLinkItem[] = [
  { to: '/properties', label: 'Explore Homes' },
  { to: '/roommates', label: 'Roommates' },
];

/** Role-specific destinations. */
const roleLinks: Record<UserRole, NavLinkItem[]> = {
  STUDENT: [
    { to: '/dashboard', label: 'My Sanctuary' },
    { to: '/saved', label: 'Saved' },
    { to: '/requests', label: 'Visits' },
    { to: '/messages', label: 'Messages' },
  ],
  OWNER: [
    { to: '/owner', label: 'My Listings' },
    { to: '/messages', label: 'Messages' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Control Center' },
    { to: '/messages', label: 'Messages' },
  ],
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, status, login, logout } = useAuth();
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

  async function handleQuickLogin(email: string): Promise<void> {
    closeMenu();
    try {
      const logged = await login({ email, password: 'Password123!' });
      showToast({
        variant: 'success',
        title: `Welcome, ${logged.name}`,
        description: `Role: ${ROLE_LABELS[logged.role]}`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e2d8] bg-[#fcfaf7]/90 backdrop-blur-md transition-colors">
      <nav aria-label="Main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-[#c8643c] text-white shadow-md shadow-[#c8643c]/20 group-hover:bg-[#a84c27] transition-all"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#141a24] flex items-center gap-1.5 leading-none">
                Rent<span className="text-[#c8643c] italic font-normal">Mate</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-[#7b8494] uppercase mt-0.5">
                Curated Student Residences
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all',
                    isActive
                      ? 'bg-[#141a24] text-white shadow-xs'
                      : 'text-[#5e6676] hover:text-[#141a24] hover:bg-[#f2ede4]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {status === 'loading' && (
              <span className="text-xs font-medium text-[#7b8494]">Verifying session…</span>
            )}

            {status === 'anonymous' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-[#f2ede4] px-2 py-1 text-xs border border-[#e5dfd4]">
                  <span className="text-[10px] font-semibold text-[#7b8494] px-1.5 uppercase">Preview:</span>
                  <button
                    type="button"
                    onClick={() => void handleQuickLogin('aditya.student@rentmate.dev')}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#141a24] hover:bg-white hover:shadow-xs transition"
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleQuickLogin('priya.owner@rentmate.dev')}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#141a24] hover:bg-white hover:shadow-xs transition"
                  >
                    🏡 Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleQuickLogin('admin@rentmate.dev')}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#141a24] hover:bg-white hover:shadow-xs transition"
                  >
                    🛡️ Admin
                  </button>
                </div>

                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#141a24] hover:bg-[#f2ede4] transition border border-[#e8e2d8]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white bg-[#c8643c] hover:bg-[#a84c27] shadow-sm transition"
                >
                  Join Circle
                </Link>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 bg-white border border-[#e8e2d8] hover:border-[#c8643c]/50 transition shadow-xs"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-full bg-[#fbf2ec] text-xs font-bold text-[#c8643c]"
                  >
                    {user.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? '')
                      .join('')}
                  </span>
                  <span className="max-w-28 truncate text-xs font-semibold text-[#141a24]">
                    {user.name}
                  </span>
                  <Badge tone={user.role === 'ADMIN' ? 'danger' : user.role === 'OWNER' ? 'warning' : 'brand'}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-medium text-[#5e6676] border border-[#e8e2d8] hover:bg-[#f2ede4] hover:text-[#141a24] transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-xl p-2 text-[#141a24] hover:bg-[#f2ede4] lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-[#e8e2d8] py-4 space-y-2 lg:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 text-sm font-semibold rounded-lg',
                    isActive ? 'bg-[#141a24] text-white' : 'text-[#5e6676] hover:bg-[#f2ede4]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="pt-3 border-t border-[#e8e2d8] space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-center rounded-xl py-2 text-xs font-semibold border border-[#e8e2d8] text-[#141a24]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block text-center rounded-xl py-2 text-xs font-semibold bg-[#c8643c] text-white"
                >
                  Join Circle
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
