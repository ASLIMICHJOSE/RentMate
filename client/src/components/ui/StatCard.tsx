import type { StatCardData } from '../../data/mockDashboard';
import { Card } from './Card';

export interface StatCardProps {
  stat: StatCardData;
}

/** Single metric tile used by the student, owner and admin dashboards. */
export function StatCard({ stat }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
      <p className="text-xs text-slate-500">{stat.hint}</p>
    </Card>
  );
}
