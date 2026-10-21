import { IsString, Length } from 'class-validator';
import {
  POST_BODY_MAX,
  POST_BODY_MIN,
  POST_TITLE_MAX,
  POST_TITLE_MIN,
} from '../../../common/constants/validation.constants';
import { Trim } from '../../../common/decorators/transform.decorators';

export class CreatePostDto {
  @Trim()
  @IsString()
  @Length(POST_TITLE_MIN, POST_TITLE_MAX, {
    message: `title must be ${POST_TITLE_MIN}–${POST_TITLE_MAX} characters`,
  })
  title: string;

  @IsString()
  @Length(POST_BODY_MIN, POST_BODY_MAX, {
    message: `body must be ${POST_BODY_MIN}–${POST_BODY_MAX} characters`,
  })
  body: string;
}
