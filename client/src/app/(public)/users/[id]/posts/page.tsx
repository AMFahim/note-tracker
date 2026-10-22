import type { Metadata } from "next";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ui/skeleton";
import { UserPostList } from "@/features/posts/components/user-post-list";

export const metadata: Metadata = { title: "Posts by user" };

export default function UserPostsPage({ params }: PageProps<"/users/[id]/posts">) {
  return (
    <Suspense fallback={<ListSkeleton withHeader />}>
      {params.then(({ id }) => (
        <UserPostList userId={id} />
      ))}
    </Suspense>
  );
}
