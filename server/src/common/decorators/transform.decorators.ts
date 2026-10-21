import { Transform } from 'class-transformer';

const normalize = (value: unknown, lowercase: boolean): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return lowercase ? trimmed.toLowerCase() : trimmed;
};

export const Trim = () =>
  Transform(({ value }: { value: unknown }) => normalize(value, false));

export const TrimLowerCase = () =>
  Transform(({ value }: { value: unknown }) => normalize(value, true));

export const NormalizeInterests = () =>
  Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? [...new Set(value.map((item: unknown) => normalize(item, true)))]
      : value,
  );
