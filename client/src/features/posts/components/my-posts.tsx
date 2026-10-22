"use client";

import { PaginatedList } from "@/components/data/paginated-list";
import { ButtonLink } from "@/components/ui/button-link";
import { useSession } from "@/features/auth/hooks";
import { useUserPosts } from "../hooks";
import { PostActions } from "./post-actions";
import { PostRow } from "./post-row";

export function MyPosts() {
  const { data: user } = useSession();
  const posts = useUserPosts(user?.id ?? "", Boolean(user));

  return (
    <PaginatedList
      {...posts}
      keyOf={(post) => post.id}
      renderItem={(post) => (
        <PostRow
          {...post}
          actions={<PostActions id={post.id} title={post.title} />}
        />
      )}
      emptyMessage="You have not published any posts yet."
      emptyAction={
        <ButtonLink href="/posts/new">Write your first post</ButtonLink>
      }
      loadMoreLabel="Load more posts"
    />
  );
}
