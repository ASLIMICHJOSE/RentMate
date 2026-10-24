import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types/property';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { AppStore } from '../../services/store';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, getInitials } from '../../utils/format';
import { AMENITY_LABELS, LISTING_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../utils/labels';

export interface PropertyCardProps {
  property: Property;
  onBookmarkChange?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

export function PropertyCard({ property, onBookmarkChange }: PropertyCardProps) {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(() => AppStore.isPropertySaved(property.id));
  const coverImage = property.images[0]?.imageUrl ?? FALLBACK_IMAGE;
  const previewAmenities = property.amenities.slice(0, 3);
  const extraAmenityCount = property.amenities.length - previewAmenities.length;

  function handleToggleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = AppStore.toggleSave(property.id);
    setIsSaved(nextSaved);
    showToast({
      variant: 'success',
      title: nextSaved ? 'Saved to shortlist' : 'Removed from saved',
      description: nextSaved
        ? `${property.title} was added to your saved properties.`
        : `${property.title} was removed.`,
    });
    onBookmarkChange?.();
  }

  return (
    <Card padded={false} className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt={`${property.title} in ${property.locality}, ${property.city}`}
          loading="lazy"
          className="h-48 w-full bg-slate-100 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone="brand" className="backdrop-blur-md bg-white/95 shadow-xs font-semibold text-brand-700">
            {PROPERTY_TYPE_LABELS[property.propertyType]}
          </Badge>
          {property.status !== 'PUBLISHED' && (
            <Badge tone={property.status === 'PENDING' ? 'warning' : 'neutral'} className="backdrop-blur-md">
              {LISTING_STATUS_LABELS[property.status]}
            </Badge>
          )}
        </div>

        {/* Interactive Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          <svg
            viewBox="0 0 24 24"
            className={`size-5 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'fill-none stroke-current'}`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* City tag on bottom of image */}
        <div className="absolute bottom-2.5 left-3 text-xs font-medium text-white drop-shadow-md">
          📍 {property.locality}, {property.city}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div>
          <h2 className="line-clamp-1 font-heading text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            <Link
              to={`/properties/${property.id}`}
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {property.title}
            </Link>
          </h2>
        </div>

        <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(property.rent)}</p>
            <span className="text-xs text-slate-500 font-medium">/ month</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Deposit {formatCurrency(property.deposit)}
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center text-xs text-slate-600">
          <div>
            <dt className="text-[10px] text-slate-400 uppercase font-medium">Beds</dt>
            <dd className="font-semibold text-slate-800">{property.bedrooms} BHK</dd>
          </div>
          <div className="border-x border-slate-200">
            <dt className="text-[10px] text-slate-400 uppercase font-medium">Baths</dt>
            <dd className="font-semibold text-slate-800">{property.bathrooms} Bath</dd>
          </div>
          <div>
            <dt className="text-[10px] text-slate-400 uppercase font-medium">Furnished</dt>
            <dd className="font-semibold text-slate-800">{property.furnished ? 'Yes' : 'No'}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5 text-xs text-slate-600">
          {previewAmenities.map((amenity) => (
            <li key={amenity} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {AMENITY_LABELS[amenity]}
            </li>
          ))}
          {extraAmenityCount > 0 && (
            <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              +{extraAmenityCount} more
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
            >
              {getInitials(property.owner.name)}
            </span>
            <div className="text-xs">
              <p className="font-medium text-slate-800">{property.owner.name}</p>
              <p className="text-[10px] text-emerald-600 font-medium">
                {property.owner.verified ? '✓ Verified Owner' : 'Owner'}
              </p>
            </div>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
          >
            Details →
          </Link>
        </div>
      </div>
    </Card>
  );
}

