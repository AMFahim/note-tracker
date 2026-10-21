import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClassName } from "./control-styles";

export function Textarea({ className, rows = 8, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClassName, "py-2 leading-6", className)}
      {...props}
    />
  );
}
