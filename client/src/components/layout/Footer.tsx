import { Link } from 'react-router-dom';

const footerGroups = [
  {
    heading: 'Discover',
    links: [
      { to: '/properties', label: 'Browse properties' },
      { to: '/roommates', label: 'Find roommates' },
      { to: '/saved', label: 'Saved properties' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { to: '/login', label: 'Log in' },
      { to: '/register', label: 'Create account' },
      { to: '/profile', label: 'Your profile' },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-bold text-slate-900">RentMate</p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            Rentals and roommates for students and young professionals &mdash; verified listings,
            transparent compatibility scores and one place to talk to owners.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-sm font-semibold text-slate-900">{group.heading}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="rounded text-sm text-slate-600 hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-slate-100 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-xs text-slate-500">
          © {new Date().getFullYear()} RentMate. Built as a full-stack demonstration project.
        </p>
      </div>
    </footer>
  );
}
