"use client";

import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { applyServerErrors } from "@/lib/form-errors";

export function useFormSubmit<TValues extends FieldValues>(
  form: UseFormReturn<TValues>,
  fields: readonly Path<TValues>[],
  action: (values: TValues) => Promise<unknown>,
) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await action(values);
    } catch (error) {
      setSubmitError(applyServerErrors(error, fields, form.setError));
    }
  });

  return { submit, submitError };
}
