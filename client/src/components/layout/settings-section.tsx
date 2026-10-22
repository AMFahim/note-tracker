import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SettingsSectionProps {
  title: string;
  description: string;
  tone?: "default" | "danger";
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  tone = "default",
  children,
}: SettingsSectionProps) {
  return (
    <section className="grid gap-4 border-t border-border pt-8 md:grid-cols-[240px_1fr] md:gap-10">
      <div className="flex flex-col gap-1">
        <h2
          className={cn(
            "text-lg font-semibold",
            tone === "danger" && "text-danger-text",
          )}
        >
          {title}
        </h2>
        <p className="text-sm text-ink-muted">{description}</p>
      </div>
      <div
        className={cn(
          "rounded-card border bg-surface p-6",
          tone === "danger" ? "border-danger-border" : "border-border",
        )}
      >
        {children}
      </div>
    </section>
  );
}
