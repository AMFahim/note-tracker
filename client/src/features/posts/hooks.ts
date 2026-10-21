"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { asItems, useCursorQuery } from "@/hooks/use-cursor-query";
import { queryKeys } from "@/lib/query-keys";
import { postsApi } from "./api";

export function usePostFeed() {
  return useCursorQuery({
    queryKey: queryKeys.posts.feed(),
    fetchPage: postsApi.feed,
    itemsOf: asItems,
  });
}

export function useUserPosts(userId: string) {
  return useCursorQuery({
    queryKey: queryKeys.posts.byUser(userId),
    fetchPage: (cursor) => postsApi.byUser(userId, cursor),
    itemsOf: (data) => data.posts,
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
      router.push(`/posts/${post.id}`);
    },
  });
}
