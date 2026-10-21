import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InterestGroups } from "@/features/users/components/interest-groups";

export const metadata: Metadata = { title: "Interests" };

export default function InterestsPage() {
  return (
    <>
      <PageHeader title="Interests" description="Users grouped by the interests on their profile." />
      <InterestGroups />
    </>
  );
}
