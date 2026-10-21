import { z } from "zod";
import { POST_BODY_MAX, POST_TITLE_MAX, POST_TITLE_MIN } from "@/lib/validation";

const titleMessage = `Title must be ${POST_TITLE_MIN}–${POST_TITLE_MAX} characters`;
const bodyMessage = `Body must be 1–${POST_BODY_MAX.toLocaleString("en-GB")} characters`;

export const postSchema = z.object({
  title: z.string().trim().min(POST_TITLE_MIN, titleMessage).max(POST_TITLE_MAX, titleMessage),
  body: z.string().min(1, bodyMessage).max(POST_BODY_MAX, bodyMessage),
});

export type PostValues = z.infer<typeof postSchema>;
