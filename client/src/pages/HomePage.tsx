import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchBar } from '../components/property/SearchBar';
import { Badge } from '../components/ui/Badge';
import { buttonStyles } from '../components/ui/buttonStyles';
import { Card } from '../components/ui/Card';
import { MOCK_PROPERTIES } from '../data/mockProperties';

const steps = [
  {
    title: 'Create your profile',
    body: 'Sign up as a student or an owner, then add the details that matter for matching.',
  },
  {
    title: 'Search and compare',
    body: 'Filter by city, rent, furnishing and amenities, then shortlist the places you like.',
  },
  {
    title: 'Match and move in',
    body: 'Message owners, book a visit and find a flatmate with a transparent compatibility score.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const featuredProperties = MOCK_PROPERTIES.filter(
    (property) => property.status === 'PUBLISHED',
  ).slice(0, 3);

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <Badge tone="brand">Rentals + roommates</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Student housing without the guesswork
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              RentMate brings verified listings, compatible flatmates and owner conversations into
              one place, so you spend less time chasing brokers and more time moving in.
            </p>

            <div className="mt-6 max-w-xl">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={(value) =>
                  navigate(value ? `/properties?q=${encodeURIComponent(value)}` : '/properties')
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/properties" className={buttonStyles({ size: 'lg' })}>
                Browse properties
              </Link>
              <Link to="/roommates" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
                Find a roommate
              </Link>
            </div>
          </div>

          <Card className="bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Why students use it
            </h2>
            <ul className="mt-4 space-y-4">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              Listings shown here are sample data used while the platform is built out. Real
              listings arrive with the database milestone.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="featured">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured" className="text-2xl font-bold tracking-tight text-slate-900">
              Featured places
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              A quick look at how listings are presented to students.
            </p>
          </div>
          <Link to="/properties" className="rounded text-sm font-medium text-brand-700">
            Browse all properties <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900">For students</h2>
            <p className="mt-2 text-sm text-slate-600">
              Save listings, compare rents, book visits, message owners and get matched with
              flatmates who share your budget and routine.
            </p>
            <Link to="/register" className={buttonStyles({ className: 'mt-4', size: 'sm' })}>
              Create a student account
            </Link>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">For owners</h2>
            <p className="mt-2 text-sm text-slate-600">
              Publish listings with photos, manage visit requests, reply to students and build a
              review history that wins more enquiries.
            </p>
            <Link
              to="/register"
              className={buttonStyles({ variant: 'outline', className: 'mt-4', size: 'sm' })}
            >
              List your property
            </Link>
          </Card>
        </div>
      </section>
    </>
  );
}
