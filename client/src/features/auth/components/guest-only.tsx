"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LoadingText } from "@/components/ui/loading-text";
import { HOME_PATH, useSession } from "../hooks";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useSession();

  useEffect(() => {
    if (user) {
      router.replace(HOME_PATH);
    }
  }, [user, router]);

  if (isPending || user) {
    return <LoadingText />;
  }
  return children;
}
