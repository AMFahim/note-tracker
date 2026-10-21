"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout, useSession } from "@/features/auth/hooks";
import { NavLink } from "./nav-link";

export function AppHeader() {
  const { data: user } = useSession();
  const logout = useLogout();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[960px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold">
          Note Tracker
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-wrap items-center gap-1">
          {user && <NavLink href="/notes">Notes</NavLink>}
          <NavLink href="/posts">Posts</NavLink>
          {user?.role === "admin" && <NavLink href="/admin">Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink href="/profile">{user.name}</NavLink>
              <Button
                variant="ghost"
                size="sm"
                pending={logout.isPending}
                pendingLabel="Signing out…"
                onClick={() => logout.mutate()}
              >
                Sign out
              </Button>
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
