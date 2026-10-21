"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { LoadingText } from "@/components/ui/loading-text";
import { useSession } from "../hooks";

export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending, error } = useSession();
  const signedOut = !isPending && !error && !user;

  useEffect(() => {
    if (signedOut) {
      router.replace("/login");
    }
  }, [signedOut, router]);

  if (error) {
    return <Alert>{error.message}</Alert>;
  }
  if (!user) {
    return <LoadingText />;
  }
  return children;
}
