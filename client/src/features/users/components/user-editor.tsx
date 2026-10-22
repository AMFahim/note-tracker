"use client";

import Link from "next/link";
import { useState } from "react";
import { QueryState } from "@/components/data/query-state";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks";
import type { User } from "@/types/api";
import { useDeleteUser, useUpdateUser, useUser } from "../hooks";
import type { EditUserValues, UpdateUserValues } from "../schemas";
import { UserForm } from "./user-form";
import { UserSummary } from "./user-summary";

export function UserEditor({ id }: { id: string }) {
  const user = useUser(id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/users"
        className="self-start text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        ← All users
      </Link>
      <QueryState
        isPending={user.isPending}
        error={user.error}
        skeleton={<FormSkeleton fields={4} withHeader />}
      >
        {user.data && <EditableUser user={user.data} />}
      </QueryState>
    </div>
  );
}

function EditableUser({ user }: { user: User }) {
  const { data: session } = useSession();
  const updateUser = useUpdateUser(user.id);
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
    <div className="flex flex-col gap-10">
      <UserSummary
        user={user}
        badge={isSelf ? "You" : undefined}
        actions={
          <>
            <ButtonLink
              variant="secondary"
              size="sm"
              href={`/admin/notes?owner=${user.id}`}
            >
              View notes
            </ButtonLink>
            <ButtonLink
              variant="secondary"
              size="sm"
              href={`/users/${user.id}/posts`}
            >
              View posts
            </ButtonLink>
          </>
        }
      />
      <SettingsSection
        title="Details"
        description="Name, email, role, password and interests for this account."
      >
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
      </SettingsSection>
      <SettingsSection
        tone="danger"
        title="Danger zone"
        description="Deleting a user also deletes all of their notes and posts."
      >
        {isSelf ? (
          <p className="text-sm text-ink-muted">
            You cannot delete your own account.
          </p>
        ) : (
          <DeleteUser user={user} />
        )}
      </SettingsSection>
    </div>
  );
}

function DeleteUser({ user }: { user: User }) {
  const deleteUser = useDeleteUser(user.id);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium">Delete this user</p>
        <p className="text-sm text-ink-muted">This cannot be undone.</p>
      </div>
      <Button variant="danger" onClick={() => setConfirming(true)}>
        Delete user
      </Button>
      <ConfirmDialog
        open={confirming}
        title={`Delete ${user.name}?`}
        description="Their account, notes and posts will be removed permanently."
        confirmLabel="Delete user"
        pendingLabel="Deleting…"
        confirmVariant="danger"
        pending={deleteUser.isPending}
        error={deleteUser.error?.message}
        onConfirm={() => deleteUser.mutate()}
        onCancel={() => {
          setConfirming(false);
          deleteUser.reset();
        }}
      />
    </div>
  );
}
