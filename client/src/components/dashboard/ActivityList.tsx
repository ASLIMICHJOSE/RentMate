import type { MockActivity } from '../../data/mockDashboard';
import { EmptyState } from '../ui/EmptyState';
import { formatRelativeTime } from '../../utils/format';

export interface ActivityListProps {
  items: MockActivity[];
}

/** Timeline of recent events shown on dashboard overviews. */
export function ActivityList({ items }: ActivityListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing here yet"
        message="Activity such as visit responses, new matches and messages will show up here."
      />
    );
  }

  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-600">{item.meta}</p>
            <time dateTime={item.at} className="text-xs text-slate-500">
              {formatRelativeTime(item.at)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
