"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
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
          <Input
            {...control}
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
        )}
      </FormField>
      <div className="flex items-center gap-4">
        <Button type="submit" pending={login.isPending} pendingLabel="Signing in…">
          Sign in
        </Button>
        <Link href="/register" className="text-sm underline underline-offset-4">
          Create an account
        </Link>
      </div>
    </form>
  );
}
