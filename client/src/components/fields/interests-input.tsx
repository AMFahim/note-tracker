"use client";

import { FormField } from "@/components/ui/form-field";
import { MultiSelect } from "@/components/ui/multi-select";
import { INTEREST_OPTIONS } from "@/lib/interests";
import {
  INTERESTS_MAX,
  interestError,
  normalizeInterest,
} from "@/lib/validation";

interface InterestsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  error?: string;
}

export function InterestsInput({
  value,
  onChange,
  onBlur,
  error,
}: InterestsInputProps) {
  return (
    <FormField
      label="Interests"
      hint={`Pick up to ${INTERESTS_MAX}. Type to search or add your own.`}
      error={error}
    >
      {(control) => (
        <MultiSelect
          {...control}
          options={INTEREST_OPTIONS}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          max={INTERESTS_MAX}
          normalize={normalizeInterest}
          validate={interestError}
          placeholder="Search interests"
        />
      )}
    </FormField>
  );
}
