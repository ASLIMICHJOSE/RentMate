import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';
import { AppStore } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';

const quickActions = [
  { to: '/properties', label: '🔍 Find a property' },
  { to: '/roommates', label: '🤝 Discover flatmates' },
  { to: '/saved', label: '❤️ Shortlisted places' },
  { to: '/requests', label: '📅 Scheduled visits' },
  { to: '/messages', label: '💬 Open chats' },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const [savedCount, setSavedCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);

  useEffect(() => {
    setSavedCount(AppStore.getSavedIds().length);
    setVisitsCount(AppStore.getVisits().length);
    setChatsCount(AppStore.getConversations().length);
  }, []);

  const stats = [
    { label: 'Saved Places', value: String(savedCount), change: 'Ready for comparison' },
    { label: 'Scheduled Visits', value: String(visitsCount), change: 'Track status in requests' },
    { label: 'Active Conversations', value: String(chatsCount), change: 'Owners & flatmates' },
    { label: 'Matches in City', value: '14 Available', change: '85%+ compatibility' },
  ];

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Student Hub"
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'Aditya'}`}
        description="Your shortlisted apartments, flatmate compatibility matches, and scheduled visits."
        actions={
          <Link to="/properties" className={buttonStyles({ size: 'sm' })}>
            Explore Listings
          </Link>
        }
      />

      <section aria-labelledby="student-stats-heading">
        <h2 id="student-stats-heading" className="sr-only">
          Your summary
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <StatCard stat={stat} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader
            title="Recent Activity & Updates"
            description="Real-time log of your bookings, messages, and saved properties."
          />
          <ul className="mt-5 space-y-3">
            <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-xl">📅</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">Visit Scheduled in Guindy</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Owner Priya Raghavan confirmed your slot for Sunlit 2BHK.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
            </li>

            <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-xl">🤝</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">New 92% Flatmate Match</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sneha Iyer from IIT Madras sent an invitation to team up for a 2BHK flat.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">2 days ago</span>
            </li>

            <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-xl">❤️</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">Property Shortlisted</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Minimalist Designer Studio in Koramangala added to your saved list.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">3 days ago</span>
            </li>
          </ul>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader title="Quick Navigation" />
          <ul className="mt-4 flex flex-col gap-2">
            {quickActions.map((action) => (
              <li key={action.to}>
                <Link
                  to={action.to}
                  className={buttonStyles({
                    variant: 'outline',
                    fullWidth: true,
                    size: 'sm',
                    className: 'justify-start font-semibold text-xs',
                  })}
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-brand-50/70 p-4 border border-brand-100 text-xs text-brand-900 space-y-1">
            <p className="font-bold">Campus Housing Tip</p>
            <p className="text-brand-800 text-[11px] leading-relaxed">
              Always schedule visits during daytime to check natural ventilation and cell reception before finalizing leases.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
