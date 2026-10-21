"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "./button";
import type { ControlProps } from "./form-field";
import { Input } from "./input";

interface TagInputProps extends ControlProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  max: number;
  normalize: (tag: string) => string;
  validate: (tag: string) => string | null;
  placeholder?: string;
}

export function TagInput({
  value,
  onChange,
  onBlur,
  max,
  normalize,
  validate,
  placeholder,
  ...control
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const isFull = value.length >= max;

  const addDraft = () => {
    const tag = normalize(draft);
    if (!tag) {
      return;
    }
    const error = validate(tag);
    if (error) {
      setDraftError(error);
      return;
    }
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
    setDraftError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraft();
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex h-7 items-center gap-1 rounded-control bg-accent-subtle pl-2 text-sm text-on-accent-subtle"
            >
              {tag}
              <button
                type="button"
                className="h-7 rounded-control px-2 hover:bg-surface-hover"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((item) => item !== tag))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          {...control}
          aria-invalid={control["aria-invalid"] || Boolean(draftError)}
          value={draft}
          disabled={isFull}
          placeholder={isFull ? `Maximum of ${max} reached` : placeholder}
          onChange={(event) => {
            setDraft(event.target.value);
            setDraftError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        />
        <Button variant="secondary" onClick={addDraft} disabled={isFull || !draft.trim()}>
          Add
        </Button>
      </div>
      {draftError && <p className="text-sm text-danger-text">{draftError}</p>}
    </div>
  );
}
