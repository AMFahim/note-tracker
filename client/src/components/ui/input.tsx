import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClassName } from "./control-styles";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClassName, "h-9", className)} {...props} />;
}
