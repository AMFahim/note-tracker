import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  danger: "border-danger-border bg-danger-subtle text-danger-ink",
  success: "border-border bg-success-subtle text-success-ink",
  warning: "border-border bg-warning-subtle text-warning-ink",
};

interface AlertProps {
  tone?: keyof typeof tones;
  children: ReactNode;
}

export function Alert({ tone = "danger", children }: AlertProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-card border px-4 py-3 text-sm", tones[tone])}
    >
      {children}
    </div>
  );
}
