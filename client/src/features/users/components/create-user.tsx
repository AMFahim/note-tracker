"use client";

import { useCreateUser } from "../hooks";
import { UserForm } from "./user-form";

export function CreateUser() {
  const createUser = useCreateUser();

  return (
    <UserForm
      mode="create"
      submitLabel="Create user"
      pendingLabel="Creating…"
      pending={createUser.isPending}
      onSubmit={createUser.mutateAsync}
    />
  );
}
