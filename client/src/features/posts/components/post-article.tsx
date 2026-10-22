"use client";

import Link from "next/link";
import { QueryState } from "@/components/data/query-state";
import { ArticleSkeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks";
import { formatDateTime } from "@/lib/format";
import { usePost } from "../hooks";
import { PostActions } from "./post-actions";

export function PostArticle({ id }: { id: string }) {
  const post = usePost(id);
  const { data: user } = useSession();

  return (
    <QueryState isPending={post.isPending} error={post.error} skeleton={<ArticleSkeleton />}>
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
            {user && post.data.author?.id === user.id && (
              <div className="mt-2 flex gap-2">
                <PostActions id={post.data.id} title={post.data.title} redirectTo="/my-posts" />
              </div>
            )}
          </header>
          <p className="max-w-[65ch] font-serif text-lg whitespace-pre-line">{post.data.body}</p>
        </article>
      )}
    </QueryState>
  );
}
