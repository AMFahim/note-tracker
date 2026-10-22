"use client";

import { useCreatePost } from "../hooks";
import { PostForm } from "./post-form";

export function CreatePost() {
  const createPost = useCreatePost();

  return (
    <PostForm
      submitLabel="Publish post"
      pendingLabel="Publishing…"
      pending={createPost.isPending}
      onSubmit={createPost.mutateAsync}
    />
  );
}
