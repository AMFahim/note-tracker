import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreatePost } from "@/features/posts/components/create-post";

export const metadata: Metadata = { title: "Write a post" };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="Write a post" />
      <CreatePost />
    </>
  );
}
