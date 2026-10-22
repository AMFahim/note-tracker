import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Profile } from "@/features/users/components/profile";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Manage your account details and password." />
      <Profile />
    </>
  );
}
