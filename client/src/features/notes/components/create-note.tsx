"use client";

import { useCreateNote } from "../hooks";
import { NoteForm } from "./note-form";

export function CreateNote() {
  const createNote = useCreateNote();

  return (
    <NoteForm
      submitLabel="Save note"
      pendingLabel="Saving…"
      pending={createNote.isPending}
      onSubmit={createNote.mutateAsync}
    />
  );
}
