import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary:
    "border border-border-control bg-canvas text-ink hover:bg-surface-hover active:bg-surface-active",
  ghost: "text-ink hover:bg-surface-hover active:bg-surface-active",
  danger: "bg-danger text-on-danger hover:bg-danger-hover",
};

const sizes = {
  md: "h-9 px-4 text-sm",
  sm: "h-8 px-3 text-sm",
};

export interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const buttonClassName = ({
  variant = "primary",
  size = "md",
}: ButtonStyleProps = {}) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
  );

type ButtonProps = ComponentProps<"button"> &
  ButtonStyleProps & {
    pending?: boolean;
    pendingLabel?: string;
  };

export function Button({
  variant = "primary",
  size = "md",
  pending = false,
  pendingLabel,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(buttonClassName({ variant, size }), className)}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
