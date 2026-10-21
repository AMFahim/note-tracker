"use client";

import { PaginatedList } from "@/components/data/paginated-list";
import { PageHeader } from "@/components/layout/page-header";
import { useUserPosts } from "../hooks";
import { PostRow } from "./post-row";

export function UserPostList({ userId }: { userId: string }) {
  const posts = useUserPosts(userId);
  const author = posts.firstPage?.data.author;

  return (
    <>
      <PageHeader title={author ? `Posts by ${author.name}` : "Posts"} />
      <PaginatedList
        {...posts}
        keyOf={(post) => post.id}
        renderItem={(post) => <PostRow {...post} />}
        emptyMessage={author ? `${author.name} has not posted yet.` : "No posts yet."}
        loadMoreLabel="Load more posts"
      />
    </>
  );
}
