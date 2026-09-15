import { Link } from 'react-router-dom';
import type { Property } from '../../types/property';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { formatCurrency, getInitials } from '../../utils/format';
import { AMENITY_LABELS, LISTING_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../utils/labels';

export interface PropertyCardProps {
  property: Property;
}

const FALLBACK_IMAGE = '/images/property-1.svg';

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images[0]?.imageUrl ?? FALLBACK_IMAGE;
  const previewAmenities = property.amenities.slice(0, 3);
  const extraAmenityCount = property.amenities.length - previewAmenities.length;

  return (
    <Card padded={false} className="overflow-hidden transition hover:shadow-md">
      <div className="relative">
        <img
          src={coverImage}
          alt={`${property.title} in ${property.locality}, ${property.city}`}
          loading="lazy"
          className="h-44 w-full bg-slate-100 object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone="brand">{PROPERTY_TYPE_LABELS[property.propertyType]}</Badge>
          {property.status !== 'PUBLISHED' && (
            <Badge tone={property.status === 'PENDING' ? 'warning' : 'neutral'}>
              {LISTING_STATUS_LABELS[property.status]}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div>
          <h2 className="line-clamp-1 text-base font-semibold text-slate-900">
            <Link
              to={`/properties/${property.id}`}
              className="rounded hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {property.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {property.locality}, {property.city}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(property.rent)}</p>
          <span className="text-sm text-slate-500">/ month</span>
        </div>

        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          <div className="flex gap-1">
            <dt className="sr-only">Bedrooms</dt>
            <dd>{property.bedrooms} bed</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Bathrooms</dt>
            <dd>{property.bathrooms} bath</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Furnishing</dt>
            <dd>{property.furnished ? 'Furnished' : 'Unfurnished'}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Deposit</dt>
            <dd>Deposit {formatCurrency(property.deposit)}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5 text-xs text-slate-600">
          {previewAmenities.map((amenity) => (
            <li key={amenity} className="rounded bg-slate-100 px-2 py-0.5">
              {AMENITY_LABELS[amenity]}
            </li>
          ))}
          {extraAmenityCount > 0 && (
            <li className="rounded bg-slate-100 px-2 py-0.5">+{extraAmenityCount} more</li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700"
            >
              {getInitials(property.owner.name)}
            </span>
            <div className="text-xs">
              <p className="font-medium text-slate-800">{property.owner.name}</p>
              <p className="text-slate-500">
                {property.owner.verified ? 'Verified owner' : 'Owner'}
              </p>
            </div>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="rounded text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            View details
            <span className="sr-only"> for {property.title}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
