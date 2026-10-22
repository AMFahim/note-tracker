"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InterestsInput } from "@/components/fields/interests-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { useFormSubmit } from "@/hooks/use-form-submit";
import {
  createUserSchema,
  editUserSchema,
  ROLE_OPTIONS,
  type EditUserValues,
} from "../schemas";

const FIELDS = ["name", "email", "password", "role", "interests"] as const;

const EMPTY_USER: EditUserValues = {
  name: "",
  email: "",
  password: "",
  role: "user",
  interests: [],
};

interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: EditUserValues;
  roleLocked?: boolean;
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  saved?: boolean;
  onSubmit: (values: EditUserValues) => Promise<unknown>;
}

export function UserForm({
  mode,
  defaultValues = EMPTY_USER,
  roleLocked = false,
  submitLabel,
  pendingLabel,
  pending,
  saved = false,
  onSubmit,
}: UserFormProps) {
  const form = useForm<EditUserValues>({
    resolver: zodResolver(mode === "create" ? createUserSchema : editUserSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, onSubmit);
  const { register, control } = form;
  const { errors, isDirty } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      {saved && !isDirty && <Alert tone="success">User saved.</Alert>}
      <FormField label="Name" error={errors.name?.message}>
        {(field) => <Input {...field} autoComplete="off" {...register("name")} />}
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        {(field) => <Input {...field} type="email" autoComplete="off" {...register("email")} />}
      </FormField>
      <FormField
        label={mode === "create" ? "Password" : "New password"}
        hint={
          mode === "create"
            ? "At least 8 characters, with a letter and a number."
            : "Leave blank to keep the current password."
        }
        error={errors.password?.message}
      >
        {(field) => (
          <PasswordInput {...field} autoComplete="new-password" {...register("password")} />
        )}
      </FormField>
      <FormField
        label="Role"
        hint={roleLocked ? "You cannot change your own role." : undefined}
        error={errors.role?.message}
      >
        {(field) => (
          <Select {...field} disabled={roleLocked} {...register("role")}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <Controller
        control={control}
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
        <Button type="submit" pending={pending} pendingLabel={pendingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
