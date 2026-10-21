import { Types } from 'mongoose';

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export const isObjectIdString = (value: unknown): value is string =>
  typeof value === 'string' && OBJECT_ID_PATTERN.test(value);

export const toObjectId = (value: string) => new Types.ObjectId(value);
