import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import type { User } from "@/types/api";

interface UserSummaryProps {
  user: User;
  badge?: string;
  actions?: ReactNode;
}

const badgeClassName =
  "rounded-control border border-border px-2 text-xs font-medium text-ink-muted";

export function UserSummary({ user, badge, actions }: UserSummaryProps) {
  return (
    <section
      aria-label="Account"
      className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface p-6"
    >
      <Avatar name={user.name} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-semibold">{user.name}</h2>
          <span className={badgeClassName}>
            {user.role === "admin" ? "Admin" : "User"}
          </span>
          {badge && <span className={badgeClassName}>{badge}</span>}
        </div>
        <p className="truncate text-sm text-ink-muted">{user.email}</p>
        <p className="text-sm text-ink-muted">
          Joined {formatDate(user.createdAt)}
        </p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </section>
  );
}
