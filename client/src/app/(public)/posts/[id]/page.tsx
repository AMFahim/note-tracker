import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleSkeleton } from "@/components/ui/skeleton";
import { PostArticle } from "@/features/posts/components/post-article";

export const metadata: Metadata = { title: "Post" };

export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      {params.then(({ id }) => (
        <PostArticle id={id} />
      ))}
    </Suspense>
  );
}
