import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingText } from "@/components/ui/loading-text";
import { PostArticle } from "@/features/posts/components/post-article";

export const metadata: Metadata = { title: "Post" };

export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <Suspense fallback={<LoadingText />}>
      {params.then(({ id }) => (
        <PostArticle id={id} />
      ))}
    </Suspense>
  );
}
