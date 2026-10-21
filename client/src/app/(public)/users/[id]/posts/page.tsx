import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingText } from "@/components/ui/loading-text";
import { UserPostList } from "@/features/posts/components/user-post-list";

export const metadata: Metadata = { title: "Posts by user" };

export default function UserPostsPage({ params }: PageProps<"/users/[id]/posts">) {
  return (
    <Suspense fallback={<LoadingText />}>
      {params.then(({ id }) => (
        <UserPostList userId={id} />
      ))}
    </Suspense>
  );
}
