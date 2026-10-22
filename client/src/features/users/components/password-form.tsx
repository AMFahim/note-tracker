"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useChangePassword } from "../hooks";
import { passwordSchema, type PasswordValues } from "../schemas";

const FIELDS = ["currentPassword", "newPassword"] as const;
const EMPTY: PasswordValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function PasswordForm() {
  const changePassword = useChangePassword();
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, async (values) => {
    await changePassword.mutateAsync(values);
    form.reset(EMPTY);
  });
  const { errors, isDirty } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      {changePassword.isSuccess && !isDirty && <Alert tone="success">Password changed.</Alert>}
      <FormField label="Current password" error={errors.currentPassword?.message}>
        {(control) => (
          <PasswordInput
            {...control}
            autoComplete="current-password"
            {...form.register("currentPassword")}
          />
        )}
      </FormField>
      <FormField
        label="New password"
        hint="At least 8 characters, with a letter and a number."
        error={errors.newPassword?.message}
      >
        {(control) => (
          <PasswordInput
            {...control}
            autoComplete="new-password"
            {...form.register("newPassword")}
          />
        )}
      </FormField>
      <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
        {(control) => (
          <PasswordInput
            {...control}
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
        )}
      </FormField>
      <div>
        <Button type="submit" pending={changePassword.isPending} pendingLabel="Changing…">
          Change password
        </Button>
      </div>
    </form>
  );
}
