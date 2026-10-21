import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClassName } from "./control-styles";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClassName, "h-9", className)} {...props} />;
}
