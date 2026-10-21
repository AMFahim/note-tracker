import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../../common/constants/role.enum';
import {
  EMAIL_MAX,
  INTEREST_MAX,
  INTEREST_MIN,
  INTERESTS_MAX,
  NAME_MAX,
  NAME_MIN,
} from '../../../common/constants/validation.constants';
import { baseSchemaOptions } from '../../../common/schemas/base-schema.options';

@Schema(baseSchemaOptions)
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: NAME_MIN,
    maxlength: NAME_MAX,
  })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, maxlength: EMAIL_MAX })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({
    type: [
      {
        type: String,
        trim: true,
        lowercase: true,
        minlength: INTEREST_MIN,
        maxlength: INTEREST_MAX,
      },
    ],
    default: [],
    validate: {
      validator: (interests: string[]) => interests.length <= INTERESTS_MAX,
      message: `interests must contain at most ${INTERESTS_MAX} items`,
    },
  })
  interests: string[];

  @Prop({ default: 0, select: false })
  tokenVersion: number;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ interests: 1 });
