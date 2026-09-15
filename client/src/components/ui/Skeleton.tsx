import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
}

/** Neutral shimmer block used to reserve layout space while data loads. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-slate-200', className)} aria-hidden="true" />
  );
}
