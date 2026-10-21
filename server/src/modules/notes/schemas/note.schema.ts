import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  NOTE_CONTENT_MAX,
  NOTE_CONTENT_MIN,
  NOTE_TITLE_MAX,
  NOTE_TITLE_MIN,
} from '../../../common/constants/validation.constants';
import { baseSchemaOptions } from '../../../common/schemas/base-schema.options';
import { User } from '../../users/schemas/user.schema';

@Schema(baseSchemaOptions)
export class Note {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    immutable: true,
  })
  owner: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: NOTE_TITLE_MIN,
    maxlength: NOTE_TITLE_MAX,
  })
  title: string;

  @Prop({
    required: true,
    minlength: NOTE_CONTENT_MIN,
    maxlength: NOTE_CONTENT_MAX,
  })
  content: string;

  createdAt: Date;
  updatedAt: Date;
}

export type NoteDocument = HydratedDocument<Note>;

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ owner: 1, _id: -1 });
