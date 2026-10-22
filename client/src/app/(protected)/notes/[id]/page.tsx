import type { Metadata } from "next";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/skeleton";
import { NoteEditor } from "@/features/notes/components/note-editor";

export const metadata: Metadata = { title: "Note" };

export default function NotePage({ params }: PageProps<"/notes/[id]">) {
  return (
    <Suspense fallback={<FormSkeleton fields={1} withHeader withTextarea />}>
      {params.then(({ id }) => (
        <NoteEditor id={id} />
      ))}
    </Suspense>
  );
}
