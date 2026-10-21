"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { asItems, useCursorQuery } from "@/hooks/use-cursor-query";
import { queryKeys } from "@/lib/query-keys";
import type { User } from "@/types/api";
import { usersApi } from "./api";
import type { UpdateUserValues } from "./schemas";

export function useUsers() {
  return useCursorQuery({
    queryKey: queryKeys.users.list(),
    fetchPage: usersApi.list,
    itemsOf: asItems,
  });
}

export function useInterestGroups() {
  return useCursorQuery({
    queryKey: queryKeys.users.interests(),
    fetchPage: usersApi.interests,
    itemsOf: asItems,
  });
}

export function useUser(id: string) {
  return useQuery({ queryKey: queryKeys.users.detail(id), queryFn: () => usersApi.get(id) });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      router.push("/admin/users");
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: UpdateUserValues) => usersApi.update(id, values),
    onSuccess: async (user: User) => {
      queryClient.setQueryData(queryKeys.users.detail(id), user);
      queryClient.setQueryData<User | null>(queryKeys.session, (session) =>
        session?.id === user.id ? user : session,
      );
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.interests() });
    },
  });
}

export function useDeleteUser(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => usersApi.remove(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notes.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
      ]);
      router.push("/admin/users");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (user) => queryClient.setQueryData(queryKeys.session, user),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: usersApi.changePassword });
}
