import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { UserTable } from "@/features/users/components/user-table";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" actions={<ButtonLink href="/admin/users/new">Add user</ButtonLink>} />
      <UserTable />
    </>
  );
}
