import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-8 text-sm",
  lg: "size-14 text-lg",
};

interface AvatarProps {
  name: string;
  size?: keyof typeof sizes;
}

export function Avatar({ name, size = "sm" }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-subtle font-semibold text-on-accent-subtle select-none",
        sizes[size],
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
