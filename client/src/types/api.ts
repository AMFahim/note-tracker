export type Role = "user" | "admin";

interface PageMeta {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface CursorPage<TData> {
  data: TData;
  meta: PageMeta;
}

export interface Single<TData> {
  data: TData;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Note {
  id: string;
  owner: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNote extends Omit<Note, "owner"> {
  owner: UserSummary | null;
}

export interface Post {
  id: string;
  author: { id: string; name: string } | null;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface PostSummary {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface UserPosts {
  author: { id: string; name: string };
  posts: PostSummary[];
}

export interface InterestGroup {
  interest: string;
  userCount: number;
  users: UserSummary[];
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
