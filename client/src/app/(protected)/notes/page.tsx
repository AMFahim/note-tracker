import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { MyNotes } from "@/features/notes/components/my-notes";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  return (
    <>
      <PageHeader title="Notes" actions={<ButtonLink href="/notes/new">New note</ButtonLink>} />
      <MyNotes />
    </>
  );
}
