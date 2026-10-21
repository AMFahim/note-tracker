import { api, apiData, withQuery } from "@/lib/api-client";
import type { AdminNote, CursorPage, Note } from "@/types/api";
import type { NoteValues } from "./schemas";

export const notesApi = {
  mine: (cursor?: string) => api<CursorPage<Note[]>>(withQuery("/notes", { cursor })),
  all: (ownerId?: string, cursor?: string) =>
    api<CursorPage<AdminNote[]>>(withQuery("/admin/notes", { ownerId, cursor })),
  get: (id: string) => apiData<Note>(`/notes/${id}`),
  create: (values: NoteValues) => apiData<Note>("/notes", { method: "POST", body: values }),
  update: (id: string, values: NoteValues) =>
    apiData<Note>(`/notes/${id}`, { method: "PATCH", body: values }),
  remove: (id: string) => api<void>(`/notes/${id}`, { method: "DELETE" }),
};
