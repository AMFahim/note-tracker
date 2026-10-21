import { api, apiData, isApiError } from "@/lib/api-client";
import type { AuthSession, User } from "@/types/api";
import type { LoginValues, RegisterValues } from "./schemas";

export const authApi = {
  async me(): Promise<User | null> {
    try {
      return await apiData<User>("/auth/me");
    } catch (error) {
      if (isApiError(error, 401)) {
        return null;
      }
      throw error;
    }
  },
  login: (values: LoginValues) =>
    apiData<AuthSession>("/auth/login", { method: "POST", body: values }),
  register: (values: RegisterValues) =>
    apiData<AuthSession>("/auth/register", { method: "POST", body: values }),
  logout: () => api<void>("/auth/logout", { method: "POST" }),
};
