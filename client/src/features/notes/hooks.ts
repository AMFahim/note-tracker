"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { asItems, useCursorQuery } from "@/hooks/use-cursor-query";
import { queryKeys } from "@/lib/query-keys";
import type { Note } from "@/types/api";
import { notesApi } from "./api";
import type { NoteValues } from "./schemas";

export function useMyNotes() {
  return useCursorQuery({
    queryKey: queryKeys.notes.mine(),
    fetchPage: notesApi.mine,
    itemsOf: asItems,
  });
}

export function useAllNotes(ownerId?: string) {
  return useCursorQuery({
    queryKey: queryKeys.notes.admin(ownerId ?? "all"),
    fetchPage: (cursor) => notesApi.all(ownerId, cursor),
    itemsOf: asItems,
  });
}

export function useNote(id: string) {
  return useQuery({ queryKey: queryKeys.notes.detail(id), queryFn: () => notesApi.get(id) });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: async (note) => {
      queryClient.setQueryData(queryKeys.notes.detail(note.id), note);
      await queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      router.push("/notes");
    },
  });
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: NoteValues) => notesApi.update(id, values),
    onSuccess: async (note: Note) => {
      queryClient.setQueryData(queryKeys.notes.detail(id), note);
      await queryClient.invalidateQueries({ queryKey: queryKeys.notes.mine() });
    },
  });
}

export function useDeleteNote(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => notesApi.remove(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.notes.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      router.push("/notes");
    },
  });
}
