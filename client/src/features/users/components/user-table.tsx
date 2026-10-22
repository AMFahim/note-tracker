"use client";

import Link from "next/link";
import { QueryState } from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useUsers } from "../hooks";

const headerCell = "px-3 py-2 text-left text-sm font-semibold";
const bodyCell = "px-3 py-3 align-top text-sm";

export function UserTable() {
  const users = useUsers();

  return (
    <QueryState isPending={users.isPending} error={users.error} skeleton={<TableSkeleton />}>
      {users.items.length === 0 ? (
        <EmptyState message="There are no users yet." />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className={headerCell}>Name</th>
                  <th scope="col" className={headerCell}>Email</th>
                  <th scope="col" className={headerCell}>Role</th>
                  <th scope="col" className={headerCell}>Interests</th>
                  <th scope="col" className={headerCell}>Joined</th>
                  <th scope="col" className={headerCell}>
                    <span className="sr-only">Links</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.items.map((user) => (
                  <tr key={user.id}>
                    <td className={bodyCell}>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="font-medium underline underline-offset-4"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className={bodyCell}>{user.email}</td>
                    <td className={bodyCell}>{user.role === "admin" ? "Admin" : "User"}</td>
                    <td className={`${bodyCell} text-ink-muted`}>
                      {user.interests.join(", ") || "None"}
                    </td>
                    <td className={`${bodyCell} whitespace-nowrap`}>{formatDate(user.createdAt)}</td>
                    <td className={`${bodyCell} whitespace-nowrap text-right`}>
                      <Link href={`/admin/notes?owner=${user.id}`} className="underline underline-offset-4">
                        Notes
                      </Link>
                      {" · "}
                      <Link href={`/users/${user.id}/posts`} className="underline underline-offset-4">
                        Posts
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.hasNextPage && (
            <div>
              <Button
                variant="secondary"
                pending={users.isFetchingNextPage}
                pendingLabel="Loading…"
                onClick={() => void users.fetchNextPage()}
              >
                Load more users
              </Button>
            </div>
          )}
        </div>
      )}
    </QueryState>
  );
}
