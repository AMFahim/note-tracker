"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const linkClassName =
  "rounded-control px-2 py-1 text-sm transition-colors duration-150 ease-out hover:bg-surface-hover";

function StaticNavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className={cn(linkClassName, "text-ink-muted")}>
      {children}
    </Link>
  );
}

function ActiveNavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        linkClassName,
        active
          ? "font-semibold text-ink underline decoration-accent decoration-2 underline-offset-8"
          : "text-ink-muted",
      )}
    >
      {children}
    </Link>
  );
}

export function NavLink(props: NavLinkProps) {
  return (
    <Suspense fallback={<StaticNavLink {...props} />}>
      <ActiveNavLink {...props} />
    </Suspense>
  );
}
