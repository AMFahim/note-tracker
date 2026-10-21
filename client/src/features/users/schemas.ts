import { z } from "zod";
import {
  emailField,
  interestsField,
  nameField,
  PASSWORD_MAX,
  passwordField,
} from "@/lib/validation";

export const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
] as const;

const roleField = z.enum(["user", "admin"], "Choose a role");

export const createUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: roleField,
  interests: interestsField,
});

export const editUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: z.union([z.literal(""), passwordField]),
  role: roleField,
  interests: interestsField,
});

export const profileSchema = z.object({
  name: nameField,
  interests: interestsField,
});

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters`),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "New password must differ from current password",
  })
  .refine((values) => values.confirmPassword === values.newPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type EditUserValues = z.infer<typeof editUserSchema>;
export type UpdateUserValues = Partial<CreateUserValues>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
