import { SchemaOptions } from 'mongoose';

const toPublicJson = (_doc: unknown, ret: Record<string, unknown>) => {
  const { _id, password, tokenVersion, ...rest } = ret;
  return { id: String(_id), ...rest };
};

export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  strictQuery: true,
  toJSON: { transform: toPublicJson },
};
