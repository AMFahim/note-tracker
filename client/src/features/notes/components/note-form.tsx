"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { noteSchema, type NoteValues } from "../schemas";

const FIELDS = ["title", "content"] as const;

interface NoteFormProps {
  defaultValues?: NoteValues;
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  saved?: boolean;
  onSubmit: (values: NoteValues) => Promise<unknown>;
}

export function NoteForm({
  defaultValues = { title: "", content: "" },
  submitLabel,
  pendingLabel,
  pending,
  saved = false,
  onSubmit,
}: NoteFormProps) {
  const form = useForm<NoteValues>({
    resolver: zodResolver(noteSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, onSubmit);
  const { errors, isDirty } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      {saved && !isDirty && <Alert tone="success">Note saved.</Alert>}
      <FormField label="Title" error={errors.title?.message}>
        {(control) => <Input {...control} {...form.register("title")} />}
      </FormField>
      <FormField label="Content" error={errors.content?.message}>
        {(control) => (
          <Textarea
            {...control}
            rows={12}
            className="font-serif text-lg"
            {...form.register("content")}
          />
        )}
      </FormField>
      <div>
        <Button type="submit" pending={pending} pendingLabel={pendingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
