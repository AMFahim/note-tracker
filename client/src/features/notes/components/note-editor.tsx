"use client";

import { QueryState } from "@/components/data/query-state";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks";
import { formatDateTime } from "@/lib/format";
import type { Note } from "@/types/api";
import { useDeleteNote, useNote, useUpdateNote } from "../hooks";
import { NoteForm } from "./note-form";

export function NoteEditor({ id }: { id: string }) {
  const note = useNote(id);
  const { data: user } = useSession();

  return (
    <QueryState
      isPending={note.isPending}
      error={note.error}
      skeleton={<FormSkeleton fields={1} withHeader withTextarea />}
    >
      {note.data &&
        (note.data.owner === user?.id ? (
          <EditableNote note={note.data} />
        ) : (
          <ReadOnlyNote note={note.data} />
        ))}
    </QueryState>
  );
}

function EditableNote({ note }: { note: Note }) {
  const updateNote = useUpdateNote(note.id);
  const deleteNote = useDeleteNote(note.id);

  return (
    <>
      <PageHeader
        title="Edit note"
        description={`Last edited ${formatDateTime(note.updatedAt)}`}
        actions={
          <ConfirmButton
            label="Delete note"
            confirmLabel="Delete permanently"
            pendingLabel="Deleting…"
            pending={deleteNote.isPending}
            onConfirm={() => deleteNote.mutate()}
          />
        }
      />
      <NoteForm
        key={note.updatedAt}
        defaultValues={{ title: note.title, content: note.content }}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        pending={updateNote.isPending}
        saved={updateNote.isSuccess}
        onSubmit={updateNote.mutateAsync}
      />
    </>
  );
}

function ReadOnlyNote({ note }: { note: Note }) {
  return (
    <article>
      <PageHeader
        title={note.title}
        description={`Read-only · last edited ${formatDateTime(note.updatedAt)}`}
      />
      <p className="max-w-[65ch] font-serif text-lg whitespace-pre-line">{note.content}</p>
    </article>
  );
}
