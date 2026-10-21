import type { Single } from "@/types/api";

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[],
  ) {
    super(messages[0] ?? "Something went wrong. Try again.");
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const messagesOf = (payload: unknown): string[] => {
  if (payload && typeof payload === "object" && "message" in payload) {
    const { message } = payload as { message: unknown };
    if (Array.isArray(message)) {
      return message.map(String);
    }
    if (typeof message === "string") {
      return [message];
    }
  }
  return [];
};

export async function api<T>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers:
      body === undefined
        ? headers
        : { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, messagesOf(payload));
  }
  return payload as T;
}

export async function apiData<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const { data } = await api<Single<T>>(path, options);
  return data;
}

export function withQuery(
  path: string,
  params: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

export const isApiError = (error: unknown, status?: number): error is ApiError =>
  error instanceof ApiError && (status === undefined || error.status === status);
