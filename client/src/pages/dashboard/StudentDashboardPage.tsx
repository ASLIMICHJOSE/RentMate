import { Link } from 'react-router-dom';
import { ActivityList } from '../../components/dashboard/ActivityList';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { MOCK_STUDENT_ACTIVITY, MOCK_STUDENT_STATS } from '../../data/mockDashboard';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';

const quickActions = [
  { to: '/properties', label: 'Find a property' },
  { to: '/roommates', label: 'Find a roommate' },
  { to: '/saved', label: 'View saved properties' },
  { to: '/requests', label: 'View requests' },
];

export default function StudentDashboardPage() {
  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Student dashboard"
        title="Welcome back"
        description="Your saved places, roommate matches, requests and messages at a glance."
        actions={
          <Link to="/properties" className={buttonStyles({ size: 'sm' })}>
            Browse properties
          </Link>
        }
      />

      <section aria-labelledby="student-stats-heading">
        <h2 id="student-stats-heading" className="sr-only">
          Your summary
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {MOCK_STUDENT_STATS.map((stat) => (
            <li key={stat.label}>
              <StatCard stat={stat} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent activity"
            description="Sample data until the dashboard queries land in Milestone 13."
          />
          <div className="mt-5">
            <ActivityList items={MOCK_STUDENT_ACTIVITY} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <ul className="mt-4 flex flex-col gap-2">
            {quickActions.map((action) => (
              <li key={action.to}>
                <Link
                  to={action.to}
                  className={buttonStyles({ variant: 'outline', fullWidth: true, size: 'sm' })}
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Personalised stats need authentication, so this page shows sample numbers until
            Milestone 4.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
