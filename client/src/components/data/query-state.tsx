import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { LoadingText } from "@/components/ui/loading-text";

interface QueryStateProps {
  isPending: boolean;
  error: Error | null;
  children: ReactNode;
}

export function QueryState({ isPending, error, children }: QueryStateProps) {
  if (isPending) {
    return <LoadingText />;
  }
  if (error) {
    return <Alert>{error.message}</Alert>;
  }
  return children;
}
