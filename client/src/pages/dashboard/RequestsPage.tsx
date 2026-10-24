import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';
import { AppStore, type RoommateRequestItem, type VisitRequestItem } from '../../services/store';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatDate, getInitials } from '../../utils/format';

export default function RequestsPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [roommateRequests, setRoommateRequests] = useState<RoommateRequestItem[]>([]);
  const [visits, setVisits] = useState<VisitRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'visits' | 'roommates'>('all');

  useEffect(() => {
    setRoommateRequests(AppStore.getRoommateRequests());
    setVisits(AppStore.getVisits());
  }, []);

  function handleUpdateRoommateStatus(id: string, status: 'ACCEPTED' | 'REJECTED') {
    AppStore.updateRoommateRequestStatus(id, status);
    setRoommateRequests(AppStore.getRoommateRequests());
    showToast({
      variant: 'success',
      title: status === 'ACCEPTED' ? 'Roommate Request Accepted!' : 'Request Declined',
      description: status === 'ACCEPTED' ? 'You can now message each other to plan move-in.' : 'Request updated.',
    });
  }

  function handleCancelVisit(id: string) {
    AppStore.updateVisitStatus(id, 'CANCELLED');
    setVisits(AppStore.getVisits());
    showToast({
      variant: 'success',
      title: 'Visit Cancelled',
      description: 'Your scheduled visit has been marked as cancelled.',
    });
  }

  function handleChatWithUser(participant: { id: string; name: string; role: string; avatarUrl: string | null }) {
    const conv = AppStore.getOrCreateConversation(participant);
    navigate('/messages', { state: { activeConversationId: conv.id } });
  }

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Activity"
        title="Your Requests & Bookings"
        description="Track all scheduled property visits and incoming/outgoing roommate connection requests."
      />

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activity ({visits.length + roommateRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('visits')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'visits'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Property Visits ({visits.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('roommates')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'roommates'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Roommate Requests ({roommateRequests.length})
        </button>
      </div>

      <div className="mt-6 space-y-8">
        {/* Visit Requests */}
        {(activeTab === 'all' || activeTab === 'visits') && (
          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <CardHeader
              title="Scheduled Property Visits"
              description="Visits requested with property owners. Owners confirm slots within 24 hours."
              action={
                <Link to="/properties" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  Book another visit
                </Link>
              }
            />

            {visits.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="No visit requests yet"
                  message="Browse properties and click 'Request a visit' to schedule an in-person viewing."
                  action={
                    <Link to="/properties" className={buttonStyles({ size: 'sm' })}>
                      Browse listings
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-slate-100">
                {visits.map((visit) => (
                  <li key={visit.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={visit.propertyImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                          alt={visit.propertyTitle}
                          className="size-16 rounded-xl object-cover shrink-0 bg-slate-100 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-sm text-slate-900">
                              {visit.propertyTitle}
                            </h3>
                            <Badge
                              tone={
                                visit.status === 'ACCEPTED'
                                  ? 'success'
                                  : visit.status === 'PENDING'
                                    ? 'warning'
                                    : visit.status === 'REJECTED'
                                      ? 'danger'
                                      : 'neutral'
                              }
                            >
                              {visit.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            📍 {visit.propertyAddress}, {visit.propertyCity} · {formatCurrency(visit.rent)}/mo
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            <span className="font-medium text-slate-900">
                              📅 Date: {formatDate(visit.preferredDate)}
                            </span>
                            <span>⏰ Slot: {visit.preferredSlot}</span>
                            <span>👤 Owner: {visit.ownerName}</span>
                          </div>
                          {visit.note && (
                            <p className="mt-1 text-xs text-slate-500 italic">"{visit.note}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleChatWithUser({
                              id: visit.ownerId,
                              name: visit.ownerName,
                              role: 'Owner',
                              avatarUrl: null,
                            })
                          }
                          className="text-xs font-semibold"
                        >
                          💬 Message Owner
                        </Button>
                        <Link
                          to={`/properties/${visit.propertyId}`}
                          className={buttonStyles({ variant: 'outline', size: 'sm' })}
                        >
                          View Listing
                        </Link>
                        {visit.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelVisit(visit.id)}
                            className="text-rose-600 hover:text-rose-700 text-xs"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* Roommate Requests */}
        {(activeTab === 'all' || activeTab === 'roommates') && (
          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <CardHeader
              title="Roommate Connection Requests"
              description="Invitations from other students to team up for apartments."
              action={
                <Link to="/roommates" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  Explore Roommates
                </Link>
              }
            />

            {roommateRequests.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="No roommate requests yet"
                  message="Check out compatible flatmates and send an invitation to team up."
                  action={
                    <Link to="/roommates" className={buttonStyles({ size: 'sm' })}>
                      Find Roommates
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-slate-100">
                {roommateRequests.map((req) => (
                  <li key={req.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-sm font-bold text-brand-700">
                          {getInitials(req.senderName)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-sm text-slate-900">
                              {req.senderName}
                            </h3>
                            <Badge tone="success" className="font-bold">
                              {req.compatibilityScore}% Compatible
                            </Badge>
                            <Badge
                              tone={
                                req.status === 'ACCEPTED'
                                  ? 'success'
                                  : req.status === 'PENDING'
                                    ? 'warning'
                                    : 'neutral'
                              }
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {req.senderOccupation} · {req.senderCity}
                          </p>
                          <p className="mt-2 text-xs text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">
                            "{req.note}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {req.status === 'PENDING' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateRoommateStatus(req.id, 'ACCEPTED')}
                              className="font-bold text-xs"
                            >
                              ✓ Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateRoommateStatus(req.id, 'REJECTED')}
                              className="text-xs font-semibold"
                            >
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Badge tone="success">Connected</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleChatWithUser({
                              id: req.senderId,
                              name: req.senderName,
                              role: 'Student',
                              avatarUrl: null,
                            })
                          }
                          className="text-xs font-semibold"
                        >
                          💬 Chat
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
