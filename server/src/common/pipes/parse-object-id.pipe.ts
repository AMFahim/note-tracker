import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { isObjectIdString } from '../utils/object-id.util';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<
  string,
  Types.ObjectId
> {
  transform(value: string): Types.ObjectId {
    if (!isObjectIdString(value)) {
      throw new BadRequestException('id must be a valid id');
    }
    return new Types.ObjectId(value);
  }
}
