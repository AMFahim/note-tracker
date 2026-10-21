import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { buttonClassName, type ButtonStyleProps } from "./button";

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonClassName({ variant, size }), className)} {...props} />;
}
