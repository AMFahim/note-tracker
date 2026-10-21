import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingText } from "@/components/ui/loading-text";
import { UserEditor } from "@/features/users/components/user-editor";

export const metadata: Metadata = { title: "Edit user" };

export default function EditUserPage({ params }: PageProps<"/admin/users/[id]">) {
  return (
    <Suspense fallback={<LoadingText />}>
      {params.then(({ id }) => (
        <UserEditor id={id} />
      ))}
    </Suspense>
  );
}
