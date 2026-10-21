"use client";

import { QueryState } from "@/components/data/query-state";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { useSession } from "@/features/auth/hooks";
import { formatDate } from "@/lib/format";
import type { User } from "@/types/api";
import { useDeleteUser, useUpdateUser, useUser } from "../hooks";
import type { EditUserValues, UpdateUserValues } from "../schemas";
import { UserForm } from "./user-form";

export function UserEditor({ id }: { id: string }) {
  const user = useUser(id);

  return (
    <QueryState isPending={user.isPending} error={user.error}>
      {user.data && <EditableUser user={user.data} />}
    </QueryState>
  );
}

function EditableUser({ user }: { user: User }) {
  const { data: session } = useSession();
  const updateUser = useUpdateUser(user.id);
  const deleteUser = useDeleteUser(user.id);
  const isSelf = session?.id === user.id;

  const submit = ({ password, role, ...values }: EditUserValues) => {
    const changes: UpdateUserValues = { ...values };
    if (password) {
      changes.password = password;
    }
    if (!isSelf) {
      changes.role = role;
    }
    return updateUser.mutateAsync(changes);
  };

  return (
    <>
      <PageHeader
        title={user.name}
        description={`Joined ${formatDate(user.createdAt)}`}
        actions={
          <>
            <ButtonLink variant="secondary" size="sm" href={`/admin/notes?owner=${user.id}`}>
              View notes
            </ButtonLink>
            {!isSelf && (
              <ConfirmButton
                label="Delete user"
                confirmLabel="Delete user and their content"
                pendingLabel="Deleting…"
                pending={deleteUser.isPending}
                onConfirm={() => deleteUser.mutate()}
              />
            )}
          </>
        }
      />
      {deleteUser.error && <Alert>{deleteUser.error.message}</Alert>}
      <UserForm
        key={user.updatedAt}
        mode="edit"
        defaultValues={{
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
          interests: user.interests,
        }}
        roleLocked={isSelf}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        pending={updateUser.isPending}
        saved={updateUser.isSuccess}
        onSubmit={submit}
      />
    </>
  );
}
