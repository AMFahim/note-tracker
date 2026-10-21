"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { useSession } from "@/features/auth/hooks";

export function WritePostLink() {
  const { data: user } = useSession();
  return user ? <ButtonLink href="/posts/new">Write a post</ButtonLink> : null;
}
