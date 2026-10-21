import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "./query-state";

interface PaginatedListProps<TItem> {
  items: TItem[];
  isPending: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  keyOf: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  emptyMessage: string;
  emptyAction?: ReactNode;
  loadMoreLabel: string;
}

export function PaginatedList<TItem>({
  items,
  isPending,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  keyOf,
  renderItem,
  emptyMessage,
  emptyAction,
  loadMoreLabel,
}: PaginatedListProps<TItem>) {
  return (
    <QueryState isPending={isPending} error={error}>
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} action={emptyAction} />
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={keyOf(item)}>{renderItem(item)}</li>
            ))}
          </ul>
          {hasNextPage && (
            <div>
              <Button
                variant="secondary"
                pending={isFetchingNextPage}
                pendingLabel="Loading…"
                onClick={() => void fetchNextPage()}
              >
                {loadMoreLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </QueryState>
  );
}
