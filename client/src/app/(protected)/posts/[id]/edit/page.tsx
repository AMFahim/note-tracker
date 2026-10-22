import type { Metadata } from "next";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/skeleton";
import { EditPost } from "@/features/posts/components/edit-post";

export const metadata: Metadata = { title: "Edit post" };

export default function EditPostPage({ params }: PageProps<"/posts/[id]/edit">) {
  return (
    <Suspense fallback={<FormSkeleton fields={1} withHeader withTextarea />}>
      {params.then(({ id }) => (
        <EditPost id={id} />
      ))}
    </Suspense>
  );
}
