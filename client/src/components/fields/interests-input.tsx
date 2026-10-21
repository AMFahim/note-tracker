"use client";

import { FormField } from "@/components/ui/form-field";
import { TagInput } from "@/components/ui/tag-input";
import { INTERESTS_MAX, interestError, normalizeInterest } from "@/lib/validation";

interface InterestsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  error?: string;
}

export function InterestsInput({ value, onChange, onBlur, error }: InterestsInputProps) {
  return (
    <FormField
      label="Interests"
      hint={`Press Enter to add. Up to ${INTERESTS_MAX}.`}
      error={error}
    >
      {(control) => (
        <TagInput
          {...control}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          max={INTERESTS_MAX}
          normalize={normalizeInterest}
          validate={interestError}
          placeholder="chess, reading, hiking"
        />
      )}
    </FormField>
  );
}
