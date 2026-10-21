"use client";

import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query";
import type { CursorPage } from "@/types/api";

interface CursorQueryOptions<TData, TItem> {
  queryKey: QueryKey;
  fetchPage: (cursor?: string) => Promise<CursorPage<TData>>;
  itemsOf: (data: TData) => TItem[];
  enabled?: boolean;
}

export function useCursorQuery<TData, TItem>({
  queryKey,
  fetchPage,
  itemsOf,
  enabled,
}: CursorQueryOptions<TData, TItem>) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    enabled,
  });

  return {
    ...query,
    firstPage: query.data?.pages[0],
    items: query.data?.pages.flatMap((page) => itemsOf(page.data)) ?? [],
  };
}

export const asItems = <T,>(data: T[]) => data;
