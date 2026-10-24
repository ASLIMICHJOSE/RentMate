import { Link } from 'react-router-dom';

const footerGroups = [
  {
    heading: 'Living Spaces',
    links: [
      { to: '/properties', label: 'Curated Residences' },
      { to: '/properties?city=Chennai', label: 'Chennai Campus Homes' },
      { to: '/properties?city=Bengaluru', label: 'Bengaluru Tech Lofts' },
      { to: '/saved', label: 'Saved Shortlist' },
    ],
  },
  {
    heading: 'Co-Living Lab',
    links: [
      { to: '/roommates', label: 'Roommate Directory' },
      { to: '/roommates', label: 'Compatibility Scouter' },
      { to: '/messages', label: 'Direct Conversations' },
    ],
  },
  {
    heading: 'Community & Access',
    links: [
      { to: '/login', label: 'Sign In' },
      { to: '/register', label: 'Join as Student' },
      { to: '/register?role=OWNER', label: 'List a Property' },
      { to: '/profile', label: 'Resident Profile' },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[#e8e2d8] bg-[#f7f3eb] text-[#141a24] relative overflow-hidden">
      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      {/* Trust Guarantee Banner */}
      <div className="border-b border-[#e8e2d8] bg-[#f0eae0]/80 py-3 px-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#5e6676]">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">✦</span>
            <span>100% In-Person Verified Residences</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#c8643c]">✦</span>
            <span>Direct Landlord Interaction — Zero Brokerage Commission</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700">✦</span>
            <span>Transparent Roommate Compatibility Engine</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#c8643c] text-white">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#141a24]">
              Rent<span className="text-[#c8643c] italic font-normal">Mate</span>
            </span>
          </div>

          <p className="max-w-sm text-sm text-[#5e6676] leading-relaxed">
            A refined sanctuary protocol for students and university scholars. Discover sunlit studio apartments, verified flatmates, and schedule private physical walkthroughs without broker interference.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[#7b8494]">
            <span className="px-2.5 py-1 rounded-md bg-[#ede6da] text-[#141a24] font-semibold">CAMPUS CIRCLE 2026</span>
            <span>•</span>
            <span>CHENNAI · BENGALURU · HYDERABAD</span>
          </div>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.heading} aria-label={group.heading} className="space-y-4">
            <h3 className="font-serif text-base font-semibold tracking-wide text-[#141a24]">
              {group.heading}
            </h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-[#5e6676] hover:text-[#c8643c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="relative border-t border-[#e8e2d8] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7b8494]">
          <p>© {new Date().getFullYear()} RentMate Living Technologies. Thoughtfully designed for student sanctuary.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#141a24] cursor-pointer">Privacy Charter</span>
            <span>·</span>
            <span className="hover:text-[#141a24] cursor-pointer">Resident Guidelines</span>
            <span>·</span>
            <span className="hover:text-[#141a24] cursor-pointer">Owner Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
