import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingText } from "@/components/ui/loading-text";
import { NoteEditor } from "@/features/notes/components/note-editor";

export const metadata: Metadata = { title: "Note" };

export default function NotePage({ params }: PageProps<"/notes/[id]">) {
  return (
    <Suspense fallback={<LoadingText />}>
      {params.then(({ id }) => (
        <NoteEditor id={id} />
      ))}
    </Suspense>
  );
}
