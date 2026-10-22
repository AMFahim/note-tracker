import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <p className="font-mono text-sm text-ink-muted">404</p>
      <h1 className="font-serif text-2xl font-semibold">Page not found</h1>
      <p className="max-w-prose text-ink-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <ButtonLink href="/">Back to posts</ButtonLink>
    </section>
  );
}
