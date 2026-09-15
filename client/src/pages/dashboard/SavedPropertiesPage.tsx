import { Link } from 'react-router-dom';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Badge } from '../../components/ui/Badge';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { PageHeader } from '../../components/ui/PageHeader';
import { getMockSavedProperties } from '../../data/mockProperties';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';

export default function SavedPropertiesPage() {
  const savedProperties = getMockSavedProperties();

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Saved"
        title="Saved properties"
        description="Everything you have shortlisted, in one place."
        actions={
          <Link to="/properties" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
            Browse more
          </Link>
        }
      />

      <div className="flex items-center gap-2">
        <Badge tone="warning">Sample data</Badge>
        <p className="text-sm text-slate-600">
          Saving and unsaving calls the API from Milestone 9.
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {savedProperties.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
}
