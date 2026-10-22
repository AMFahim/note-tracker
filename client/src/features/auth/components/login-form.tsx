"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useLogin } from "../hooks";
import { loginSchema, type LoginValues } from "../schemas";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, login.mutateAsync);
  const { errors } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      <FormField label="Email" error={errors.email?.message}>
        {(control) => (
          <Input {...control} type="email" autoComplete="email" {...form.register("email")} />
        )}
      </FormField>
      <FormField label="Password" error={errors.password?.message}>
        {(control) => (
          <PasswordInput
            {...control}
            autoComplete="current-password"
            {...form.register("password")}
          />
        )}
      </FormField>
      <Button
        type="submit"
        pending={login.isPending}
        pendingLabel="Signing in…"
        className="mt-2 w-full"
      >
        Sign in
      </Button>
    </form>
  );
}
