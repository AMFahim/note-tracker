"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { asItems, useCursorQuery } from "@/hooks/use-cursor-query";
import { queryKeys } from "@/lib/query-keys";
import type { Post } from "@/types/api";
import { postsApi } from "./api";
import type { PostValues } from "./schemas";

export function usePostFeed() {
  return useCursorQuery({
    queryKey: queryKeys.posts.feed(),
    fetchPage: postsApi.feed,
    itemsOf: asItems,
  });
}

export function useUserPosts(userId: string, enabled?: boolean) {
  return useCursorQuery({
    queryKey: queryKeys.posts.byUser(userId),
    fetchPage: (cursor) => postsApi.byUser(userId, cursor),
    itemsOf: (data) => data.posts,
    enabled,
  });
}

export function usePost(id: string) {
  return useQuery({ queryKey: queryKeys.posts.detail(id), queryFn: () => postsApi.get(id) });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: async (post) => {
      queryClient.setQueryData(queryKeys.posts.detail(post.id), post);
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      router.push("/my-posts");
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (values: PostValues) => postsApi.update(id, values),
    onSuccess: async (post: Post) => {
      queryClient.setQueryData(queryKeys.posts.detail(id), post);
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      router.push("/my-posts");
    },
  });
}

export function useDeletePost(id: string, redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => postsApi.remove(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
  });
}
