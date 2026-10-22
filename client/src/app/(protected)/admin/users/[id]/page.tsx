import type { Metadata } from "next";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/skeleton";
import { UserEditor } from "@/features/users/components/user-editor";

export const metadata: Metadata = { title: "Edit user" };

export default function EditUserPage({ params }: PageProps<"/admin/users/[id]">) {
  return (
    <Suspense fallback={<FormSkeleton fields={4} withHeader />}>
      {params.then(({ id }) => (
        <UserEditor id={id} />
      ))}
    </Suspense>
  );
}
