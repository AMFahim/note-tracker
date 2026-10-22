"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeletePost } from "../hooks";

interface PostActionsProps {
  id: string;
  title: string;
  redirectTo?: string;
}

export function PostActions({ id, title, redirectTo }: PostActionsProps) {
  const deletePost = useDeletePost(id, redirectTo);
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <ButtonLink href={`/posts/${id}/edit`} variant="secondary" size="sm">
        Edit
      </ButtonLink>
      <Button variant="secondary" size="sm" onClick={() => setConfirming(true)}>
        Delete
      </Button>
      <ConfirmDialog
        open={confirming}
        title="Delete post?"
        description={`“${title}” will be removed permanently.`}
        confirmLabel="Delete post"
        pendingLabel="Deleting…"
        confirmVariant="danger"
        pending={deletePost.isPending}
        error={deletePost.error?.message}
        onConfirm={() =>
          deletePost.mutate(undefined, {
            onSuccess: () => setConfirming(false),
          })
        }
        onCancel={() => {
          setConfirming(false);
          deletePost.reset();
        }}
      />
    </>
  );
}
