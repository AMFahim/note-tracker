import { z } from "zod";
import {
  emailField,
  interestsField,
  nameField,
  PASSWORD_MAX,
  passwordField,
} from "@/lib/validation";

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, "Password is required")
    .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters`),
});

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  interests: interestsField,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
