import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import type { AdminNote, Note } from "@/types/api";

interface NoteRowProps {
  note: Note | AdminNote;
  ownerName?: string;
}

export function NoteRow({ note, ownerName }: NoteRowProps) {
  return (
    <article className="flex flex-col gap-1 py-4">
      <h2 className="font-semibold">
        <Link href={`/notes/${note.id}`} className="hover:underline underline-offset-4">
          {note.title}
        </Link>
      </h2>
      <p className="line-clamp-2 font-serif text-ink-muted">{note.content}</p>
      <p className="text-sm text-ink-muted">
        {ownerName && <>{ownerName} · </>}
        Edited {formatDateTime(note.updatedAt)}
      </p>
    </article>
  );
}
