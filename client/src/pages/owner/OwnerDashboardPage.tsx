import { Link } from 'react-router-dom';
import { Badge, type BadgeTone } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { MOCK_OWNER_STATS } from '../../data/mockDashboard';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { OWNER_NAV } from '../../layouts/dashboardNav';
import type { ListingStatus } from '../../types/property';
import { formatCurrency } from '../../utils/format';
import { LISTING_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../utils/labels';

const statusTones: Record<ListingStatus, BadgeTone> = {
  PUBLISHED: 'success',
  PENDING: 'warning',
  REJECTED: 'danger',
  RENTED: 'brand',
  ARCHIVED: 'neutral',
};

/** Sample listings for the signed-in owner until listings come from the API. */
const myProperties = MOCK_PROPERTIES.filter((property) => property.owner.id === 'owner-1');

export default function OwnerDashboardPage() {
  return (
    <DashboardLayout nav={OWNER_NAV} navLabel="Owner dashboard">
      <PageHeader
        eyebrow="Owner dashboard"
        title="Your listings"
        description="Track how each listing is performing and what needs your attention."
        actions={
          <Button disabled title="Listing creation arrives in Milestone 6">
            Add property
          </Button>
        }
      />

      <section aria-labelledby="owner-stats-heading">
        <h2 id="owner-stats-heading" className="sr-only">
          Listing summary
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {MOCK_OWNER_STATS.map((stat) => (
            <li key={stat.label}>
              <StatCard stat={stat} />
            </li>
          ))}
        </ul>
      </section>

      <Card>
        <CardHeader
          title="My properties"
          description="Sample listings used to build the management table; real data arrives with property CRUD in Milestone 6."
          action={<Badge tone="warning">Sample data</Badge>}
        />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Your property listings with status and rent</caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Listing
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Type
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Rent
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Status
                </th>
                <th scope="col" className="py-2 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {myProperties.map((property) => (
                <tr key={property.id} className="border-b border-slate-100 last:border-0">
                  <th scope="row" className="py-3 pr-4 font-medium text-slate-900">
                    {property.title}
                    <span className="block text-xs font-normal text-slate-500">
                      {property.locality}, {property.city}
                    </span>
                  </th>
                  <td className="py-3 pr-4 text-slate-600">
                    {PROPERTY_TYPE_LABELS[property.propertyType]}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{formatCurrency(property.rent)}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={statusTones[property.status]}>
                      {LISTING_STATUS_LABELS[property.status]}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        title="Editing arrives in Milestone 6"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled
                        title="Deleting arrives in Milestone 6"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Pending visit requests" />
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">Single room in a friendly 3BHK flat</p>
                <p className="text-slate-600">Requested for 20 Sep, 11:00 · 2 days ago</p>
              </div>
              <Badge tone="warning">Awaiting reply</Badge>
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Accepting and rejecting visits arrives in Milestone 13.
          </p>
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <Button variant="outline" fullWidth size="sm" disabled title="Arrives in Milestone 6">
                Add a property
              </Button>
            </li>
            <li>
              <Button variant="outline" fullWidth size="sm" disabled title="Arrives in Milestone 6">
                Manage listings
              </Button>
            </li>
            <li>
              <Link
                to="/messages"
                className={buttonStyles({ variant: 'outline', fullWidth: true, size: 'sm' })}
              >
                View messages
              </Link>
            </li>
            <li>
              <Button
                variant="outline"
                fullWidth
                size="sm"
                disabled
                title="Arrives in Milestone 16"
              >
                See reviews
              </Button>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
