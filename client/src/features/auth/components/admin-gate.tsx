"use client";

import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { useSession } from "../hooks";

export function AdminGate({ children }: { children: ReactNode }) {
  const { data: user } = useSession();

  if (user?.role !== "admin") {
    return <Alert>You need an administrator account to view this page.</Alert>;
  }
  return children;
}
