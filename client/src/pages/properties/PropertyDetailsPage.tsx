import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PropertyGallery } from '../../components/property/PropertyGallery';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { fetchPropertyById } from '../../data/mockApi';
import { ApiRequestError } from '../../services/http';
import type { Property } from '../../types/property';
import { formatCurrency, formatDate, getInitials } from '../../utils/format';
import { AMENITY_LABELS, PROPERTY_TYPE_LABELS } from '../../utils/labels';

interface DetailState {
  status: 'loading' | 'ready' | 'error';
  property?: Property;
  error?: string;
  errorCode?: string;
}

export default function PropertyDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [state, setState] = useState<DetailState>({ status: 'loading' });

  useEffect(() => {
    let ignore = false;

    fetchPropertyById(id)
      .then((property) => {
        if (ignore) return;
        setState({ status: 'ready', property });
      })
      .catch((caught: unknown) => {
        if (ignore) return;
        setState({
          status: 'error',
          error:
            caught instanceof ApiRequestError
              ? caught.message
              : 'We could not load this property right now.',
          errorCode: caught instanceof ApiRequestError ? caught.code : undefined,
        });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingState message="Loading property details…" />
      </div>
    );
  }

  if (state.status === 'error' || !state.property) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-16 sm:px-6">
        <ErrorState
          title="Property unavailable"
          message={state.error ?? 'This property could not be found.'}
          code={state.errorCode}
        />
        <Link to="/properties" className={buttonStyles({ variant: 'outline' })}>
          Back to all properties
        </Link>
      </div>
    );
  }

  const property = state.property;

  const facts = [
    { label: 'Property type', value: PROPERTY_TYPE_LABELS[property.propertyType] },
    { label: 'Bedrooms', value: String(property.bedrooms) },
    { label: 'Bathrooms', value: String(property.bathrooms) },
    { label: 'Furnishing', value: property.furnished ? 'Furnished' : 'Unfurnished' },
    { label: 'Area', value: property.areaSqft ? `${property.areaSqft} sq ft` : 'Not specified' },
    { label: 'Available from', value: formatDate(property.availableFrom) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-slate-500">
          <li>
            <Link to="/" className="rounded hover:text-brand-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/properties" className="rounded hover:text-brand-700">
              Properties
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-700">{property.locality}</li>
        </ol>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{PROPERTY_TYPE_LABELS[property.propertyType]}</Badge>
              {property.furnished && <Badge tone="neutral">Furnished</Badge>}
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-2 text-slate-600">
              {property.address} · {property.city}
            </p>
          </div>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">About this place</h2>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-600">
              {property.description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-emerald-600">
                    ✓
                  </span>
                  {AMENITY_LABELS[amenity]}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Reviews"
              description="Ratings from students who visited or rented."
            />
            <div className="mt-4">
              <EmptyState
                title="No reviews yet"
                message="Reviews open in Milestone 16 and will appear here with the reviewer's name and rating."
                className="py-10"
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(property.rent)}
              <span className="text-base font-normal text-slate-500"> / month</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Deposit {formatCurrency(property.deposit)}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Button disabled title="Visit requests arrive in Milestone 13">
                Request a visit
              </Button>
              <Button variant="outline" disabled title="Messaging arrives in Milestone 14">
                Contact owner
              </Button>
              <Button variant="ghost" disabled title="Saved properties arrive in Milestone 9">
                Save property
              </Button>
            </div>

            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              Saving, visit requests and messaging are wired to the API in Milestones 9, 13 and 14.
            </p>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-slate-900">Listed by</h2>
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
              >
                {getInitials(property.owner.name)}
              </span>
              <div>
                <p className="font-medium text-slate-900">{property.owner.name}</p>
                <p className="text-xs text-slate-500">
                  Member since {formatDate(property.owner.memberSince)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {property.owner.verified
                ? 'Identity and ownership documents verified by RentMate.'
                : 'Ownership verification for this account is still pending.'}
            </p>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-slate-900">Listing details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Listed on</dt>
                <dd className="text-slate-800">{formatDate(property.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Last updated</dt>
                <dd className="text-slate-800">{formatDate(property.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
