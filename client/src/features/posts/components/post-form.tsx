"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { postSchema, type PostValues } from "../schemas";

const FIELDS = ["title", "body"] as const;

interface PostFormProps {
  defaultValues?: PostValues;
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  onSubmit: (values: PostValues) => Promise<unknown>;
}

export function PostForm({
  defaultValues = { title: "", body: "" },
  submitLabel,
  pendingLabel,
  pending,
  onSubmit,
}: PostFormProps) {
  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, onSubmit);
  const { errors } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      <FormField label="Title" error={errors.title?.message}>
        {(control) => <Input {...control} {...form.register("title")} />}
      </FormField>
      <FormField
        label="Body"
        hint="Posts are public."
        error={errors.body?.message}
      >
        {(control) => (
          <Textarea
            {...control}
            rows={12}
            className="font-serif text-lg"
            {...form.register("body")}
          />
        )}
      </FormField>
      <div className="flex gap-2">
        <Button type="submit" pending={pending} pendingLabel={pendingLabel}>
          {submitLabel}
        </Button>
        <ButtonLink href="/my-posts" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
