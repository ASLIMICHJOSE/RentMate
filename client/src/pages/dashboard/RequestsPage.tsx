import { Link } from 'react-router-dom';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';

export default function RequestsPage() {
  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Requests"
        title="Your requests"
        description="Roommate requests and property visit requests, with their current status."
      />

      <Card>
        <CardHeader
          title="Roommate requests"
          description="Requests you send and receive once roommate matching is live."
        />
        <div className="mt-4">
          <EmptyState
            title="No roommate requests yet"
            message="Roommate requests arrive in Milestone 12. Until then you can still browse matches and scores."
            action={
              <Link to="/roommates" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                See roommate matches
              </Link>
            }
            className="py-10"
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Visit requests"
          description="Ask an owner to show you a place, then track accept or reject decisions."
        />
        <div className="mt-4">
          <EmptyState
            title="No visit requests yet"
            message="Visit scheduling opens in Milestone 13, together with statuses such as accepted, rejected and completed."
            action={
              <Link to="/properties" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                Find a property to visit
              </Link>
            }
            className="py-10"
          />
        </div>
      </Card>
    </DashboardLayout>
  );
}
