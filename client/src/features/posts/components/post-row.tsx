import Link from "next/link";
import { formatDate } from "@/lib/format";

interface PostRowProps {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author?: { id: string; name: string } | null;
}

export function PostRow({ id, title, body, createdAt, author }: PostRowProps) {
  return (
    <article className="flex flex-col gap-1 py-4">
      <h2 className="font-semibold">
        <Link href={`/posts/${id}`} className="hover:underline underline-offset-4">
          {title}
        </Link>
      </h2>
      <p className="line-clamp-2 font-serif text-ink-muted">{body}</p>
      <p className="text-sm text-ink-muted">
        {author && (
          <>
            <Link href={`/users/${author.id}/posts`} className="underline underline-offset-4">
              {author.name}
            </Link>
            {" · "}
          </>
        )}
        {formatDate(createdAt)}
      </p>
    </article>
  );
}
