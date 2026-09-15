import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

/** Placeholder that mirrors `PropertyCard` so the grid does not jump when data arrives. */
export function PropertyCardSkeleton() {
  return (
    <Card padded={false} className="overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
    </Card>
  );
}
