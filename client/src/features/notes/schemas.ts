import { z } from "zod";
import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX } from "@/lib/validation";

const titleMessage = `Title must be 1–${NOTE_TITLE_MAX} characters`;
const contentMessage = `Content must be 1–${NOTE_CONTENT_MAX.toLocaleString("en-GB")} characters`;

export const noteSchema = z.object({
  title: z.string().trim().min(1, titleMessage).max(NOTE_TITLE_MAX, titleMessage),
  content: z.string().min(1, contentMessage).max(NOTE_CONTENT_MAX, contentMessage),
});

export type NoteValues = z.infer<typeof noteSchema>;
