import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { MyPosts } from "@/features/posts/components/my-posts";

export const metadata: Metadata = { title: "My posts" };

export default function MyPostsPage() {
  return (
    <>
      <PageHeader
        title="My posts"
        description="Your public posts. Everyone can read them."
        actions={<ButtonLink href="/posts/new">Write a post</ButtonLink>}
      />
      <MyPosts />
    </>
  );
}
