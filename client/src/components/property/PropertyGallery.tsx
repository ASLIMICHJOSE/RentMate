import { useState } from 'react';
import type { PropertyImage } from '../../types/property';
import { cn } from '../../utils/cn';

const FALLBACK_IMAGE = '/images/property-1.svg';

export interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

/**
 * Main image plus thumbnails.
 *
 * Thumbnails are real buttons with `aria-pressed`, so the gallery is fully
 * keyboard operable; the main image is described by its alt text.
 */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages =
    images.length > 0 ? images : [{ id: 'fallback', imageUrl: FALLBACK_IMAGE, sortOrder: 0 }];
  const active = safeImages[Math.min(activeIndex, safeImages.length - 1)] ?? safeImages[0];

  return (
    <div className="flex flex-col gap-3">
      <img
        src={active?.imageUrl ?? FALLBACK_IMAGE}
        alt={`${title} - photo ${Math.min(activeIndex, safeImages.length - 1) + 1} of ${safeImages.length}`}
        className="h-64 w-full rounded-xl bg-slate-100 object-cover sm:h-96"
      />

      {safeImages.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                className={cn(
                  'overflow-hidden rounded-lg border-2',
                  index === activeIndex
                    ? 'border-brand-600'
                    : 'border-transparent hover:border-slate-300',
                )}
              >
                <img
                  src={image.imageUrl}
                  alt={`Show photo ${index + 1} of ${safeImages.length}`}
                  loading="lazy"
                  className="size-20 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
