import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { isApiError } from "./api-client";

const GENERIC_ERROR = "Something went wrong. Try again.";
const RATE_LIMITED = "Too many attempts. Wait a minute and try again.";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const humanizeField = (message: string, field: string) =>
  capitalize(field.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)) +
  message.slice(field.length);

export function applyServerErrors<TValues extends FieldValues>(
  error: unknown,
  fields: readonly Path<TValues>[],
  setError: UseFormSetError<TValues>,
): string | null {
  if (!isApiError(error)) {
    return GENERIC_ERROR;
  }
  if (error.status === 429) {
    return RATE_LIMITED;
  }
  const unmatched: string[] = [];
  for (const message of error.messages) {
    const field = fields.find((name) => message.startsWith(`${name} `));
    if (field) {
      setError(field, { message: humanizeField(message, field) });
    } else {
      unmatched.push(capitalize(message));
    }
  }
  return unmatched.length ? unmatched.join(". ") : null;
}
