"use client";

import { QueryState } from "@/components/data/query-state";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks";
import type { Post } from "@/types/api";
import { usePost, useUpdatePost } from "../hooks";
import { PostForm } from "./post-form";

export function EditPost({ id }: { id: string }) {
  const post = usePost(id);
  const { data: user } = useSession();

  return (
    <QueryState
      isPending={post.isPending}
      error={post.error}
      skeleton={<FormSkeleton fields={1} withHeader withTextarea />}
    >
      {post.data &&
        (post.data.author?.id === user?.id ? (
          <EditablePost post={post.data} />
        ) : (
          <Alert>You can only edit your own posts.</Alert>
        ))}
    </QueryState>
  );
}

function EditablePost({ post }: { post: Post }) {
  const updatePost = useUpdatePost(post.id);

  return (
    <>
      <PageHeader title="Edit post" />
      <PostForm
        defaultValues={{ title: post.title, body: post.body }}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        pending={updatePost.isPending}
        onSubmit={updatePost.mutateAsync}
      />
    </>
  );
}
