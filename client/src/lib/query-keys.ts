export const queryKeys = {
  session: ["session"] as const,
  notes: {
    all: ["notes"] as const,
    mine: () => [...queryKeys.notes.all, "mine"] as const,
    detail: (id: string) => [...queryKeys.notes.all, "detail", id] as const,
    admin: (ownerId: string) =>
      [...queryKeys.notes.all, "admin", ownerId] as const,
  },
  posts: {
    all: ["posts"] as const,
    feed: () => [...queryKeys.posts.all, "feed"] as const,
    detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
    byUser: (userId: string) =>
      [...queryKeys.posts.all, "by-user", userId] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
    interests: () => [...queryKeys.users.all, "interests"] as const,
  },
};
