import { IsString, Length } from 'class-validator';
import {
  NOTE_CONTENT_MAX,
  NOTE_CONTENT_MIN,
  NOTE_TITLE_MAX,
  NOTE_TITLE_MIN,
} from '../../../common/constants/validation.constants';
import { Trim } from '../../../common/decorators/transform.decorators';

export class CreateNoteDto {
  @Trim()
  @IsString()
  @Length(NOTE_TITLE_MIN, NOTE_TITLE_MAX, {
    message: `title must be ${NOTE_TITLE_MIN}–${NOTE_TITLE_MAX} characters`,
  })
  title: string;

  @IsString()
  @Length(NOTE_CONTENT_MIN, NOTE_CONTENT_MAX, {
    message: `content must be ${NOTE_CONTENT_MIN}–${NOTE_CONTENT_MAX} characters`,
  })
  content: string;
}
