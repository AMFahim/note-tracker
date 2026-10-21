"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { InterestsInput } from "@/components/fields/interests-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useRegister } from "../hooks";
import { registerSchema, type RegisterValues } from "../schemas";

const FIELDS = ["name", "email", "password", "interests"] as const;

export function RegisterForm() {
  const registerUser = useRegister();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", interests: [] },
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, registerUser.mutateAsync);
  const { errors } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      <FormField label="Name" error={errors.name?.message}>
        {(control) => <Input {...control} autoComplete="name" {...form.register("name")} />}
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        {(control) => (
          <Input {...control} type="email" autoComplete="email" {...form.register("email")} />
        )}
      </FormField>
      <FormField
        label="Password"
        hint="At least 8 characters, with a letter and a number."
        error={errors.password?.message}
      >
        {(control) => (
          <Input
            {...control}
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
        )}
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
      <div className="flex items-center gap-4">
        <Button type="submit" pending={registerUser.isPending} pendingLabel="Creating account…">
          Create account
        </Button>
        <Link href="/login" className="text-sm underline underline-offset-4">
          I already have an account
        </Link>
      </div>
    </form>
  );
}
