import { z } from "zod";

const NAME_MIN = 2;
const NAME_MAX = 50;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export const INTERESTS_MAX = 10;
const INTEREST_MIN = 2;
const INTEREST_MAX = 30;
const INTEREST_PATTERN = /^[a-z0-9][a-z0-9 -]*$/;

export const NOTE_TITLE_MAX = 120;
export const NOTE_CONTENT_MAX = 10_000;

export const POST_TITLE_MIN = 3;
export const POST_TITLE_MAX = 150;
export const POST_BODY_MAX = 5_000;

export const nameField = z
  .string()
  .trim()
  .min(NAME_MIN, `Name must be ${NAME_MIN}–${NAME_MAX} characters`)
  .max(NAME_MAX, `Name must be ${NAME_MIN}–${NAME_MAX} characters`);

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(EMAIL_MAX, `Email must be at most ${EMAIL_MAX} characters`)
  .pipe(z.email("Enter a valid email address"));

export const passwordField = z
  .string()
  .min(PASSWORD_MIN, `Password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters`)
  .max(PASSWORD_MAX, `Password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters`)
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

export const normalizeInterest = (value: string) => value.trim().toLowerCase();

export const interestError = (interest: string): string | null => {
  if (interest.length < INTEREST_MIN || interest.length > INTEREST_MAX) {
    return `Interests must be ${INTEREST_MIN}–${INTEREST_MAX} characters`;
  }
  if (!INTEREST_PATTERN.test(interest)) {
    return "Interests may only contain letters, numbers, spaces or hyphens";
  }
  return null;
};

export const interestsField = z
  .array(z.string())
  .max(INTERESTS_MAX, `Add at most ${INTERESTS_MAX} interests`)
  .superRefine((interests, context) => {
    const invalid = interests.map(interestError).find(Boolean);
    if (invalid) {
      context.addIssue({ code: "custom", message: invalid });
    }
  });
