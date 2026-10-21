"use client";

import Link from "next/link";
import { PaginatedList } from "@/components/data/paginated-list";
import { useAllNotes } from "../hooks";
import { NoteRow } from "./note-row";

export function AllNotes({ ownerId }: { ownerId?: string }) {
  const notes = useAllNotes(ownerId);
  const ownerName = ownerId ? notes.items[0]?.owner?.name : undefined;

  return (
    <div className="flex flex-col gap-4">
      {ownerId && (
        <p className="text-sm text-ink-muted">
          {ownerName ? `Showing notes by ${ownerName}.` : "Showing notes by one user."}{" "}
          <Link href="/admin/notes" className="text-ink underline underline-offset-4">
            Show all notes
          </Link>
        </p>
      )}
      <PaginatedList
        {...notes}
        keyOf={(note) => note.id}
        renderItem={(note) => <NoteRow note={note} ownerName={note.owner?.name} />}
        emptyMessage={ownerId ? "This user has no notes." : "Nobody has written a note yet."}
        loadMoreLabel="Load more notes"
      />
    </div>
  );
}
