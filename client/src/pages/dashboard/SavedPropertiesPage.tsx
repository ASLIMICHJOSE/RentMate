import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Badge } from '../../components/ui/Badge';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { AppStore } from '../../services/store';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';
import type { Property } from '../../types/property';

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  function reloadSaved() {
    setSavedProperties(AppStore.getSavedProperties());
  }

  useEffect(() => {
    reloadSaved();
  }, []);

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Shortlist"
        title="Saved Properties"
        description="All the apartments, studios and rooms you've bookmarked for easy comparison."
        actions={
          <Link to="/properties" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
            Browse More Listings
          </Link>
        }
      />

      <div className="flex items-center gap-2">
        <Badge tone="brand">{savedProperties.length} Shortlisted</Badge>
        <p className="text-xs text-slate-500">
          Click the heart icon on any card to remove it from your shortlist.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your shortlist is empty"
            message="You haven't saved any properties yet. Explore verified listings and bookmark places you like."
            action={
              <Link to="/properties" className={buttonStyles({ size: 'sm' })}>
                Find places to save
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedProperties.map((property) => (
            <li key={property.id}>
              <PropertyCard property={property} onBookmarkChange={reloadSaved} />
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
}
