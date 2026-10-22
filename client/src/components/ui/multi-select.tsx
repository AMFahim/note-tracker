"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { ControlProps } from "./form-field";
import { Input } from "./input";

interface MultiSelectProps extends ControlProps {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  max: number;
  normalize: (option: string) => string;
  validate: (option: string) => string | null;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  onBlur,
  max,
  normalize,
  validate,
  placeholder,
  ...control
}: MultiSelectProps) {
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [queryError, setQueryError] = useState<string | null>(null);
  const isFull = value.length >= max;

  const normalizedQuery = normalize(query);
  const matches = useMemo(
    () => options.filter((option) => option.includes(normalizedQuery)),
    [options, normalizedQuery],
  );
  const canCreate =
    normalizedQuery !== "" &&
    !options.includes(normalizedQuery) &&
    !value.includes(normalizedQuery);
  const items = canCreate ? [...matches, normalizedQuery] : matches;
  const optionId = (index: number) => `${listboxId}-${index}`;

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    if (isFull) {
      setQueryError(`You can pick up to ${max}`);
      return;
    }
    const error = validate(option);
    if (error) {
      setQueryError(error);
      return;
    }
    onChange([...value, option]);
    setQuery("");
    setQueryError(null);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        Math.max(Math.min(index + 1, items.length - 1), 0),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && items[activeIndex]) {
        toggle(items[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Backspace" && !query && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected">
          {value.map((option) => (
            <li
              key={option}
              className="inline-flex h-7 items-center gap-1 rounded-control bg-accent-subtle pl-2 text-sm text-on-accent-subtle"
            >
              {option}
              <button
                type="button"
                className="h-7 rounded-control px-2 hover:bg-surface-hover"
                aria-label={`Remove ${option}`}
                onClick={() => toggle(option)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <Input
          {...control}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && items.length ? optionId(activeIndex) : undefined
          }
          aria-invalid={control["aria-invalid"] || Boolean(queryError)}
          autoComplete="off"
          value={query}
          placeholder={isFull ? `Maximum of ${max} reached` : placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setQueryError(null);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setOpen(false);
            onBlur?.();
          }}
        />
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-control border border-border bg-canvas py-1 shadow-[0_4px_12px_rgb(0_0_0/0.12)]"
          >
            {items.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-muted">No matches</li>
            )}
            {items.map((option, index) => {
              const selected = value.includes(option);
              const isCreate = canCreate && index === items.length - 1;
              return (
                <li
                  key={isCreate ? `create-${option}` : option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => toggle(option)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                    index === activeIndex && "bg-surface-hover",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-control border",
                      selected
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border-control",
                    )}
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  {isCreate ? <>Add “{option}”</> : option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {queryError && <p className="text-sm text-danger-text">{queryError}</p>}
    </div>
  );
}
