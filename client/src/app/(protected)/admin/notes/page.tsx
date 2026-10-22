import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ListSkeleton } from "@/components/ui/skeleton";
import { AllNotes } from "@/features/notes/components/all-notes";

export const metadata: Metadata = { title: "All notes" };

export default function AdminNotesPage({ searchParams }: PageProps<"/admin/notes">) {
  return (
    <>
      <PageHeader title="All notes" description="Notes from every user, newest first." />
      <Suspense fallback={<ListSkeleton />}>
        {searchParams.then(({ owner }) => (
          <AllNotes key={String(owner)} ownerId={typeof owner === "string" ? owner : undefined} />
        ))}
      </Suspense>
    </>
  );
}
