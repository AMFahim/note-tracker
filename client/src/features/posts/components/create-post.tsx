"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useCreatePost } from "../hooks";
import { postSchema, type PostValues } from "../schemas";

const FIELDS = ["title", "body"] as const;

export function CreatePost() {
  const createPost = useCreatePost();
  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", body: "" },
    mode: "onTouched",
  });
  const { submit, submitError } = useFormSubmit(form, FIELDS, createPost.mutateAsync);
  const { errors } = form.formState;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      {submitError && <Alert>{submitError}</Alert>}
      <FormField label="Title" error={errors.title?.message}>
        {(control) => <Input {...control} {...form.register("title")} />}
      </FormField>
      <FormField label="Body" hint="Posts are public." error={errors.body?.message}>
        {(control) => (
          <Textarea
            {...control}
            rows={12}
            className="font-serif text-lg"
            {...form.register("body")}
          />
        )}
      </FormField>
      <div>
        <Button type="submit" pending={createPost.isPending} pendingLabel="Publishing…">
          Publish post
        </Button>
      </div>
    </form>
  );
}
