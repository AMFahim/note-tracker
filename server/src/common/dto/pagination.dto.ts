import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  INTEREST_MAX,
  INTEREST_MIN,
  INTEREST_PATTERN,
  PAGE_LIMIT_DEFAULT,
  PAGE_LIMIT_MAX,
} from '../constants/validation.constants';
import { TrimLowerCase } from '../decorators/transform.decorators';

class PageLimitDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: `limit must be 1–${PAGE_LIMIT_MAX}` })
  @Max(PAGE_LIMIT_MAX, { message: `limit must be 1–${PAGE_LIMIT_MAX}` })
  limit: number = PAGE_LIMIT_DEFAULT;
}

export class CursorPaginationDto extends PageLimitDto {
  @IsOptional()
  @IsMongoId({ message: 'cursor must be a valid id' })
  cursor?: string;
}

export class InterestPaginationDto extends PageLimitDto {
  @IsOptional()
  @TrimLowerCase()
  @IsString()
  @Length(INTEREST_MIN, INTEREST_MAX, {
    message: 'cursor must be a valid interest',
  })
  @Matches(INTEREST_PATTERN, { message: 'cursor must be a valid interest' })
  cursor?: string;
}
