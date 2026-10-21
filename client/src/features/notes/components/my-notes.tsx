"use client";

import { PaginatedList } from "@/components/data/paginated-list";
import { ButtonLink } from "@/components/ui/button-link";
import { useMyNotes } from "../hooks";
import { NoteRow } from "./note-row";

export function MyNotes() {
  const notes = useMyNotes();

  return (
    <PaginatedList
      {...notes}
      keyOf={(note) => note.id}
      renderItem={(note) => <NoteRow note={note} />}
      emptyMessage="You have no notes yet."
      emptyAction={<ButtonLink href="/notes/new">Write your first note</ButtonLink>}
      loadMoreLabel="Load more notes"
    />
  );
}
