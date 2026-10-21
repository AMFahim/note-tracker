"use client";

import Link from "next/link";
import { PaginatedList } from "@/components/data/paginated-list";
import { useInterestGroups } from "../hooks";

export function InterestGroups() {
  const groups = useInterestGroups();

  return (
    <PaginatedList
      {...groups}
      keyOf={(group) => group.interest}
      renderItem={(group) => (
        <section className="flex flex-col gap-2 py-4">
          <h2 className="font-semibold">
            {group.interest}{" "}
            <span className="font-normal text-ink-muted">
              · {group.userCount} {group.userCount === 1 ? "person" : "people"}
            </span>
          </h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {group.users.map((user) => (
              <li key={user.id}>
                <Link href={`/admin/users/${user.id}`} className="underline underline-offset-4">
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      emptyMessage="No user has listed an interest yet."
      loadMoreLabel="Load more interests"
    />
  );
}
