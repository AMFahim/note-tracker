import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-control bg-surface-active motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

function SkeletonStatus({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" className={className}>
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}

function HeaderSkeleton({
  withDescription = true,
}: {
  withDescription?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <Skeleton className="h-8 w-56" />
      {withDescription && <Skeleton className="h-5 w-40" />}
    </div>
  );
}

function ListRows({ rows }: { rows: number }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex flex-col gap-2 py-4">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({
  rows = 4,
  withHeader = false,
}: {
  rows?: number;
  withHeader?: boolean;
}) {
  return (
    <SkeletonStatus>
      {withHeader && <HeaderSkeleton withDescription={false} />}
      <ListRows rows={rows} />
    </SkeletonStatus>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <SkeletonStatus className="overflow-hidden rounded-card border border-border">
      <div className="flex gap-6 bg-surface px-3 py-3">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex gap-6 px-3 py-4">
            {Array.from({ length: columns }, (_, index) => (
              <Skeleton key={index} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </SkeletonStatus>
  );
}

export function ArticleSkeleton() {
  return (
    <SkeletonStatus className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex max-w-[65ch] flex-col gap-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </SkeletonStatus>
  );
}

interface FormSkeletonProps {
  fields: number;
  withHeader?: boolean;
  withTextarea?: boolean;
  fullWidthButton?: boolean;
}

export function FormSkeleton({
  fields,
  withHeader = false,
  withTextarea = false,
  fullWidthButton = false,
}: FormSkeletonProps) {
  return (
    <SkeletonStatus>
      {withHeader && <HeaderSkeleton />}
      <div className="flex flex-col gap-4">
        {Array.from({ length: fields }, (_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        {withTextarea && (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-72 w-full" />
          </div>
        )}
        <Skeleton
          className={cn("h-9", fullWidthButton ? "mt-2 w-full" : "w-32")}
        />
      </div>
    </SkeletonStatus>
  );
}

export function PageSkeleton() {
  return (
    <SkeletonStatus>
      <HeaderSkeleton />
      <ListRows rows={4} />
    </SkeletonStatus>
  );
}
