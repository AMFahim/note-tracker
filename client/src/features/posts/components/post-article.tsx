"use client";

import Link from "next/link";
import { QueryState } from "@/components/data/query-state";
import { formatDateTime } from "@/lib/format";
import { usePost } from "../hooks";

export function PostArticle({ id }: { id: string }) {
  const post = usePost(id);

  return (
    <QueryState isPending={post.isPending} error={post.error}>
      {post.data && (
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{post.data.title}</h1>
            <p className="text-sm text-ink-muted">
              {post.data.author && (
                <>
                  <Link
                    href={`/users/${post.data.author.id}/posts`}
                    className="underline underline-offset-4"
                  >
                    {post.data.author.name}
                  </Link>
                  {" · "}
                </>
              )}
              {formatDateTime(post.data.createdAt)}
            </p>
          </header>
          <p className="max-w-[65ch] font-serif text-lg whitespace-pre-line">{post.data.body}</p>
        </article>
      )}
    </QueryState>
  );
}
