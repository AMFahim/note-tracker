"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { isApiError } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

function createQueryClient() {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({ onError: endSessionOnUnauthorized }),
    mutationCache: new MutationCache({ onError: endSessionOnUnauthorized }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => !isApiError(error) && failureCount < 2,
      },
    },
  });

  function endSessionOnUnauthorized(error: Error) {
    if (isApiError(error, 401)) {
      client.setQueryData(queryKeys.session, null);
    }
  }

  return client;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
