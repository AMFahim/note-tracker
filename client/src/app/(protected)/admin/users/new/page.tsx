import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateUser } from "@/features/users/components/create-user";

export const metadata: Metadata = { title: "Add user" };

export default function NewUserPage() {
  return (
    <>
      <PageHeader title="Add user" />
      <div className="max-w-md">
        <CreateUser />
      </div>
    </>
  );
}
