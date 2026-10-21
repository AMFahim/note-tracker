import { IsMongoId, IsOptional } from 'class-validator';
import { CursorPaginationDto } from '../../../common/dto/pagination.dto';

export class AdminNotesQueryDto extends CursorPaginationDto {
  @IsOptional()
  @IsMongoId({ message: 'ownerId must be a valid id' })
  ownerId?: string;
}
