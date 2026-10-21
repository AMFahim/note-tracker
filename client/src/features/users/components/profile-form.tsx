"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InterestsInput } from "@/components/fields/interests-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { User } from "@/types/api";
import { useUpdateProfile } from "../hooks";
import { profileSchema, type ProfileValues } from "../schemas";

const FIELDS = ["name", "interests"] as const;

export function ProfileForm({ user }: { user: User }) {
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, interests: user.interests },
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, async (values) => {
    const saved = await updateProfile.mutateAsync(values);
    form.reset({ name: saved.name, interests: saved.interests });
  });
  const { errors, isDirty } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      {updateProfile.isSuccess && !isDirty && <Alert tone="success">Profile saved.</Alert>}
      <FormField label="Name" error={errors.name?.message}>
        {(control) => <Input {...control} autoComplete="name" {...form.register("name")} />}
      </FormField>
      <FormField label="Email" hint="Ask an administrator to change your email.">
        {(control) => <Input {...control} value={user.email} readOnly disabled />}
      </FormField>
      <Controller
        control={form.control}
        name="interests"
        render={({ field, fieldState }) => (
          <InterestsInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <div>
        <Button type="submit" pending={updateProfile.isPending} pendingLabel="Saving…">
          Save profile
        </Button>
      </div>
    </form>
  );
}
