import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-border px-4 py-6">
      <p className="text-ink-muted">{message}</p>
      {action}
    </div>
  );
}
