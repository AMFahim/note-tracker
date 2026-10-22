import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  footer: { text: string; linkLabel: string; href: string };
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
}: AuthCardProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 pt-4 md:pt-10">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-ink-muted">{description}</p>
      </header>
      <div className="rounded-card border border-border bg-surface p-6">
        {children}
      </div>
      <p className="text-center text-sm text-ink-muted">
        {footer.text}{" "}
        <Link
          href={footer.href}
          className="font-medium text-ink underline underline-offset-4"
        >
          {footer.linkLabel}
        </Link>
      </p>
    </section>
  );
}
