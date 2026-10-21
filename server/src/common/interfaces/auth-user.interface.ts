import { Request } from 'express';
import { Types } from 'mongoose';
import { Role } from '../constants/role.enum';

export interface AuthUser {
  id: Types.ObjectId;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  ver: number;
}

export type AuthenticatedRequest = Request & { user: AuthUser };
