import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PostFeed } from "@/features/posts/components/post-feed";
import { WritePostLink } from "@/features/posts/components/write-post-link";

export const metadata: Metadata = { title: "Posts" };

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Posts"
        description="Public posts from everyone, newest first."
        actions={<WritePostLink />}
      />
      <PostFeed />
    </>
  );
}
