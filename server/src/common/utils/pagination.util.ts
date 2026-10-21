import { Types } from 'mongoose';
import { toObjectId } from './object-id.util';

interface PageMeta {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export class Page<T> {
  constructor(
    readonly data: T,
    readonly meta: PageMeta,
  ) {}
}

export function sliceWindow<T>(
  rows: T[],
  limit: number,
  cursorOf: (row: T) => string,
): { items: T[]; meta: PageMeta } {
  const hasNextPage = rows.length > limit;
  const items = hasNextPage ? rows.slice(0, limit) : rows;
  const last = items.at(-1);
  return {
    items,
    meta: {
      limit,
      hasNextPage,
      nextCursor: hasNextPage && last ? cursorOf(last) : null,
    },
  };
}

export function toPage<T>(
  rows: T[],
  limit: number,
  cursorOf: (row: T) => string,
): Page<T[]> {
  const { items, meta } = sliceWindow(rows, limit, cursorOf);
  return new Page(items, meta);
}

export const cursorOfId = (row: { _id: Types.ObjectId }) =>
  row._id.toHexString();

export const beforeCursor = (cursor?: string) =>
  cursor ? { _id: { $lt: toObjectId(cursor) } } : {};
