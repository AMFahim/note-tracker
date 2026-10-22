"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useSession } from "@/features/auth/hooks";
import { NavLink } from "./nav-link";

export function AppHeader() {
  const { data: user } = useSession();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[960px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold">
          Note Tracker
        </Link>
        <nav
          aria-label="Main"
          className="flex flex-1 flex-wrap items-center gap-1"
        >
          <NavLink href="/">Posts</NavLink>
          {user && <NavLink href="/my-posts">My posts</NavLink>}
          {user && <NavLink href="/notes">Notes</NavLink>}
          {user?.role === "admin" && <NavLink href="/admin">Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/profile"
                aria-label={`Profile: ${user.name}`}
                title={user.name}
                className="rounded-full transition-shadow duration-150 ease-out hover:ring-2 hover:ring-border-control"
              >
                <Avatar name={user.name} />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <NavLink href="/login">Sign in</NavLink>
              <NavLink href="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
