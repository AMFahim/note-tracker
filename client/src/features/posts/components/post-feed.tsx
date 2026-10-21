"use client";

import { PaginatedList } from "@/components/data/paginated-list";
import { usePostFeed } from "../hooks";
import { PostRow } from "./post-row";

export function PostFeed() {
  const posts = usePostFeed();

  return (
    <PaginatedList
      {...posts}
      keyOf={(post) => post.id}
      renderItem={(post) => <PostRow {...post} />}
      emptyMessage="Nobody has posted yet."
      loadMoreLabel="Load more posts"
    />
  );
}
