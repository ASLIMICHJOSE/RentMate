import { ActivityList } from '../../components/dashboard/ActivityList';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { MOCK_ADMIN_ACTIVITY, MOCK_ADMIN_STATS } from '../../data/mockDashboard';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ADMIN_NAV } from '../../layouts/dashboardNav';

const adminModules = [
  {
    title: 'User management',
    description: 'Search accounts, review roles and suspend or restore access.',
    milestone: 'Milestone 18',
  },
  {
    title: 'Property moderation',
    description: 'Approve pending listings and remove content that breaks the rules.',
    milestone: 'Milestone 18',
  },
  {
    title: 'Reports',
    description: 'Work through reports raised against listings, users and messages.',
    milestone: 'Milestone 17',
  },
  {
    title: 'Analytics',
    description: 'Track sign-ups, published listings and platform growth over time.',
    milestone: 'Milestone 18',
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout nav={ADMIN_NAV} navLabel="Admin navigation">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Health of the marketplace: accounts, listings, moderation queue and reports."
        actions={<Badge tone="warning">Sample data</Badge>}
      />

      <section aria-labelledby="admin-stats-heading">
        <h2 id="admin-stats-heading" className="sr-only">
          Platform statistics
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MOCK_ADMIN_STATS.map((stat) => (
            <li key={stat.label}>
              <StatCard stat={stat} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Moderation modules"
              description="Each module is built in the milestone shown, behind role-based checks on the server."
            />
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {adminModules.map((module) => (
                <li key={module.title} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-slate-900">{module.title}</h3>
                    <Badge tone="neutral">{module.milestone}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{module.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    disabled
                    title={`Available in ${module.milestone}`}
                  >
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Moderation queue" />
            <p className="mt-4 text-sm text-slate-600">
              14 listings are pending review and 6 reports are open. The queue is sample data; the
              real endpoints are protected admin routes added in Milestones 17 and 18.
            </p>
          </Card>
        </div>

        <Card>
          <CardHeader title="Recent activity" />
          <div className="mt-5">
            <ActivityList items={MOCK_ADMIN_ACTIVITY} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
