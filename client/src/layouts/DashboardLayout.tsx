import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

export interface DashboardNavItem {
  label: string;
  /** Route to navigate to; omit for items that arrive in a later milestone. */
  to?: string;
  /** When set, the item renders disabled with this explanation. */
  unavailableReason?: string;
}

export interface DashboardLayoutProps {
  nav: DashboardNavItem[];
  navLabel: string;
  children: ReactNode;
}

/**
 * Shell for the student, owner and admin areas.
 *
 * Sidebar on desktop, horizontally scrollable nav on mobile. Items for
 * unbuilt pages render disabled with the milestone that will deliver them,
 * so nothing links to a dead route.
 */
export function DashboardLayout({ nav, navLabel, children }: DashboardLayoutProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <nav aria-label={navLabel} className="lg:w-60 lg:shrink-0">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {nav.map((item) => (
            <li key={item.label} className="shrink-0 lg:shrink">
              {item.to ? (
                <NavLink
                  to={item.to}
                  end={item.to.split('/').length <= 2}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 lg:bg-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <span
                  title={item.unavailableReason ?? 'Coming soon'}
                  className="block cursor-not-allowed rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-400"
                >
                  {item.label}
                  <span className="sr-only">
                    {item.unavailableReason ? ` - ${item.unavailableReason}` : ' - coming soon'}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1 space-y-6">{children}</div>
    </div>
  );
}
