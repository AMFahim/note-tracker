import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { ListSkeleton } from "@/components/ui/skeleton";

interface QueryStateProps {
  isPending: boolean;
  skeleton?: ReactNode;
  error: Error | null;
  children: ReactNode;
}

export function QueryState({
  isPending,
  error,
  skeleton = <ListSkeleton />,
  children,
}: QueryStateProps) {
  if (isPending) {
    return skeleton;
  }
  if (error) {
    return <Alert>{error.message}</Alert>;
  }
  return children;
}
