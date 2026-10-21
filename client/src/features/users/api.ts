import { api, apiData, withQuery } from "@/lib/api-client";
import type { CursorPage, InterestGroup, User } from "@/types/api";
import type {
  CreateUserValues,
  PasswordValues,
  ProfileValues,
  UpdateUserValues,
} from "./schemas";

export const usersApi = {
  list: (cursor?: string) => api<CursorPage<User[]>>(withQuery("/users", { cursor })),
  interests: (cursor?: string) =>
    api<CursorPage<InterestGroup[]>>(withQuery("/users/interests", { cursor })),
  get: (id: string) => apiData<User>(`/users/${id}`),
  create: (values: CreateUserValues) => apiData<User>("/users", { method: "POST", body: values }),
  update: (id: string, values: UpdateUserValues) =>
    apiData<User>(`/users/${id}`, { method: "PATCH", body: values }),
  remove: (id: string) => api<void>(`/users/${id}`, { method: "DELETE" }),
  updateProfile: (values: ProfileValues) =>
    apiData<User>("/users/me", { method: "PATCH", body: values }),
  changePassword: ({ currentPassword, newPassword }: PasswordValues) =>
    api<void>("/auth/password", {
      method: "PATCH",
      body: { currentPassword, newPassword },
    }),
};
