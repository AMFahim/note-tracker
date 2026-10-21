import { api, apiData, withQuery } from "@/lib/api-client";
import type { CursorPage, Post, UserPosts } from "@/types/api";
import type { PostValues } from "./schemas";

export const postsApi = {
  feed: (cursor?: string) => api<CursorPage<Post[]>>(withQuery("/posts", { cursor })),
  get: (id: string) => apiData<Post>(`/posts/${id}`),
  byUser: (userId: string, cursor?: string) =>
    api<CursorPage<UserPosts>>(withQuery(`/users/${userId}/posts`, { cursor })),
  create: (values: PostValues) => apiData<Post>("/posts", { method: "POST", body: values }),
};
