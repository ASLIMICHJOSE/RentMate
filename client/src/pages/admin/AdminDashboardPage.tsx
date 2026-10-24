import { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ADMIN_NAV } from '../../layouts/dashboardNav';
import { AppStore, type StoredUser, type PlatformReport } from '../../services/store';
import { useToast } from '../../hooks/useToast';
import type { Property, UserRole } from '../../types/property';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminDashboardPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'reports' | 'analytics'>('moderation');
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [reports, setReports] = useState<PlatformReport[]>([]);
  const [userSearch, setUserSearch] = useState('');

  function reloadData() {
    setProperties(AppStore.getProperties());
    setUsers(AppStore.getUsers());
    setReports(AppStore.getReports());
  }

  useEffect(() => {
    reloadData();
  }, []);

  function handleApproveProperty(id: string, title: string) {
    AppStore.updateProperty(id, { status: 'PUBLISHED' });
    reloadData();
    showToast({
      variant: 'success',
      title: 'Property Approved',
      description: `"${title}" has been published and is now searchable by students.`,
    });
  }

  function handleRejectProperty(id: string, title: string) {
    AppStore.updateProperty(id, { status: 'REJECTED' });
    reloadData();
    showToast({
      variant: 'error',
      title: 'Property Rejected',
      description: `"${title}" was rejected and hidden from search.`,
    });
  }

  function handleToggleUserActive(userId: string, name: string) {
    const nextActive = AppStore.toggleUserStatus(userId);
    reloadData();
    showToast({
      variant: nextActive ? 'success' : 'warning',
      title: nextActive ? 'Account Activated' : 'Account Suspended',
      description: `${name}'s account access has been ${nextActive ? 'restored' : 'restricted'}.`,
    });
  }

  function handleChangeUserRole(userId: string, newRole: UserRole) {
    AppStore.updateUserRole(userId, newRole as any);
    reloadData();
    showToast({
      variant: 'success',
      title: 'Role Updated',
      description: `User role changed to ${newRole}.`,
    });
  }

  function handleResolveReport(id: string) {
    AppStore.updateReportStatus(id, 'RESOLVED');
    reloadData();
    showToast({
      variant: 'success',
      title: 'Report Resolved',
      description: 'Action recorded in platform audit logs.',
    });
  }

  function handleDismissReport(id: string) {
    AppStore.updateReportStatus(id, 'DISMISSED');
    reloadData();
    showToast({
      variant: 'info',
      title: 'Report Dismissed',
      description: 'Report marked as dismissed.',
    });
  }

  const pendingListings = properties.filter((p) => p.status === 'PENDING');
  const activeReports = reports.filter((r) => r.status === 'PENDING' || r.status === 'REVIEWING');
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.city} ${u.role}`.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <DashboardLayout nav={ADMIN_NAV} navLabel="Admin navigation">
      <PageHeader
        eyebrow="Super Admin Portal"
        title="Platform Oversight & Moderation"
        description="Review incoming property submissions, manage user account permissions, resolve dispute reports, and monitor health metrics."
      />

      {/* Global Platform KPIs */}
      <section aria-labelledby="admin-stats-heading" className="mt-4">
        <h2 id="admin-stats-heading" className="sr-only">
          Platform statistics
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StatCard
              stat={{
                label: 'Registered Users',
                value: String(users.length + 120),
                change: '+18% this month',
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Pending Approvals',
                value: String(pendingListings.length),
                change: pendingListings.length > 0 ? 'Requires moderation' : 'Queue clean',
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Active Listings',
                value: String(properties.filter((p) => p.status === 'PUBLISHED').length),
                change: 'Across 5 major cities',
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Open Reports',
                value: String(activeReports.length),
                change: 'Safety & rule violations',
              }}
            />
          </li>
        </ul>
      </section>

      {/* Navigation Pills */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'moderation'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Property Moderation ({pendingListings.length} pending)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'reports'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Safety & Reports ({activeReports.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'analytics'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Platform Analytics
        </button>
      </div>

      {/* Tab 1: Property Moderation */}
      {activeTab === 'moderation' && (
        <Card className="mt-6 rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader
            title="Property Verification Queue"
            description="Inspect new landlord submissions before they become visible to student search."
          />

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase bg-slate-50/60">
                  <th scope="col" className="py-3 px-4">
                    Property
                  </th>
                  <th scope="col" className="py-3 px-4">
                    City & Type
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Monthly Rent
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Owner
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {prop.title}
                      <span className="block text-xs font-normal text-slate-500">{prop.address}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {prop.city} · {prop.propertyType}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(prop.rent)}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {prop.owner.name}
                    </td>
                    <td className="py-3 px-4">
                      <Badge tone={prop.status === 'PUBLISHED' ? 'success' : prop.status === 'PENDING' ? 'warning' : 'neutral'}>
                        {prop.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {prop.status !== 'PUBLISHED' && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveProperty(prop.id, prop.title)}
                            className="text-xs font-bold"
                          >
                            ✓ Approve
                          </Button>
                        )}
                        {prop.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectProperty(prop.id, prop.title)}
                            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'users' && (
        <Card className="mt-6 rounded-2xl border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">User Account Management</h2>
              <p className="text-xs text-slate-500">Manage user roles, inspect verification, and toggle suspension.</p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, city..."
                className="w-full rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-brand-600 border border-transparent focus:border-brand-500"
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase bg-slate-50/60">
                  <th scope="col" className="py-3 px-4">
                    User Details
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-4">
                    City
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Platform Role
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Account Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Toggle Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name}
                      <span className="block text-xs font-normal text-slate-500">{u.occupation}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">{u.city}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u.id, e.target.value as any)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="OWNER">OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge tone={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={u.isActive ? 'outline' : 'default'}
                        onClick={() => handleToggleUserActive(u.id, u.name)}
                        className={`text-xs ${
                          u.isActive ? 'text-rose-600 border-rose-200 hover:bg-rose-50' : 'bg-emerald-600'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <Card className="mt-6 rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader
            title="User Safety & Moderation Reports"
            description="Issues raised by students and owners regarding content accuracy and behavior."
          />

          <ul className="mt-5 divide-y divide-slate-100">
            {reports.map((rep) => (
              <li key={rep.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                      {rep.targetType} REPORT
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-900">{rep.reason}</h3>
                    <Badge tone={rep.status === 'RESOLVED' ? 'success' : rep.status === 'PENDING' ? 'warning' : 'neutral'}>
                      {rep.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Subject: <span className="font-semibold">{rep.targetTitle}</span> · Reported by {rep.reporterName} on {formatDate(rep.createdAt)}
                  </p>
                  <p className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{rep.details}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleResolveReport(rep.id)}
                        className="text-xs font-bold"
                      >
                        ✓ Mark Resolved
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissReport(rep.id)}
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Tab 4: Analytics */}
      {activeTab === 'analytics' && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs p-6">
            <h3 className="font-heading text-base font-bold text-slate-900 mb-4">
              Geographic Distribution of Listings
            </h3>
            <div className="space-y-3">
              {[
                { city: 'Chennai', count: 35, percentage: 42 },
                { city: 'Bengaluru', count: 28, percentage: 34 },
                { city: 'Hyderabad', count: 12, percentage: 14 },
                { city: 'Pune', count: 8, percentage: 10 },
              ].map((item) => (
                <div key={item.city}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{item.city}</span>
                    <span>{item.count} properties ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 shadow-xs p-6">
            <h3 className="font-heading text-base font-bold text-slate-900 mb-4">
              Student Housing Demand by Type
            </h3>
            <div className="space-y-3">
              {[
                { type: 'Shared Student Rooms & Flats', demand: 'Very High', rate: 48 },
                { type: 'Private Studios', demand: 'High', rate: 28 },
                { type: '2BHK / 3BHK Entire Apartments', demand: 'Moderate', rate: 16 },
                { type: 'PG Accommodations', demand: 'Steady', rate: 8 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{item.type}</span>
                    <span className="text-brand-600 font-bold">{item.rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
