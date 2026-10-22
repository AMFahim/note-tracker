"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import type { AuthSession, User } from "@/types/api";
import { authApi } from "./api";
import type { LoginValues, RegisterValues } from "./schemas";

export const HOME_PATH = "/notes";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: authApi.me,
    staleTime: 5 * 60_000,
  });
}

function replaceSession(queryClient: QueryClient, user: User | null) {
  queryClient.setQueryData(queryKeys.session, user);
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== queryKeys.session[0],
  });
}

function useStartSession() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return ({ user }: AuthSession) => {
    replaceSession(queryClient, user);
    router.replace(HOME_PATH);
  };
}

export function useLogin() {
  const startSession = useStartSession();
  return useMutation({
    mutationFn: (values: LoginValues) => authApi.login(values),
    onSuccess: startSession,
  });
}

export function useRegister() {
  const startSession = useStartSession();
  return useMutation({
    mutationFn: (values: RegisterValues) => authApi.register(values),
    onSuccess: startSession,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      replaceSession(queryClient, null);
      router.replace("/login");
    },
  });
}
