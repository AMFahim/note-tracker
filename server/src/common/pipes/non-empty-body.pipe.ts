import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NonEmptyBodyPipe implements PipeTransform<object, object> {
  transform(value: object): object {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException(
        'Request body must contain at least one field',
      );
    }
    return value;
  }
}
