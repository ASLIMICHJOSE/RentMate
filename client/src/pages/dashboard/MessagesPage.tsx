import { Link } from 'react-router-dom';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';

export default function MessagesPage() {
  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Messages"
        title="Messages"
        description="Conversations with owners and flatmates, in real time."
      />

      <EmptyState
        title="Messaging opens in Milestone 14"
        message="Conversations, message history and unread counts are delivered by the Socket.IO milestone. The page shell is ready for it."
        action={
          <Link to="/properties" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
            Browse properties instead
          </Link>
        }
      />
    </DashboardLayout>
  );
}
