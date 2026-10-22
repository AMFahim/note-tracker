"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { HOME_PATH, useSession } from "../hooks";

interface GuestOnlyProps {
  fallback: ReactNode;
  children: ReactNode;
}

export function GuestOnly({ fallback, children }: GuestOnlyProps) {
  const router = useRouter();
  const { data: user, isPending } = useSession();

  useEffect(() => {
    if (user) {
      router.replace(HOME_PATH);
    }
  }, [user, router]);

  if (isPending || user) {
    return fallback;
  }
  return children;
}
