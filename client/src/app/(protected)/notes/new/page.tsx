import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateNote } from "@/features/notes/components/create-note";

export const metadata: Metadata = { title: "New note" };

export default function NewNotePage() {
  return (
    <>
      <PageHeader title="New note" />
      <CreateNote />
    </>
  );
}
