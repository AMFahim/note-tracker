import { Types } from 'mongoose';

export interface InterestGroup {
  interest: string;
  userCount: number;
  users: { id: Types.ObjectId; name: string; email: string }[];
}
