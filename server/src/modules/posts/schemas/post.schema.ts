import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  POST_BODY_MAX,
  POST_BODY_MIN,
  POST_TITLE_MAX,
  POST_TITLE_MIN,
} from '../../../common/constants/validation.constants';
import { baseSchemaOptions } from '../../../common/schemas/base-schema.options';
import { User } from '../../users/schemas/user.schema';

@Schema(baseSchemaOptions)
export class Post {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    immutable: true,
  })
  author: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: POST_TITLE_MIN,
    maxlength: POST_TITLE_MAX,
  })
  title: string;

  @Prop({ required: true, minlength: POST_BODY_MIN, maxlength: POST_BODY_MAX })
  body: string;

  createdAt: Date;
  updatedAt: Date;
}

export type PostDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ author: 1, _id: -1 });
