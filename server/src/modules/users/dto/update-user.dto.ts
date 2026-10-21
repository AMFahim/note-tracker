import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto, RegisterUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto extends PartialType(
  PickType(RegisterUserDto, ['name', 'interests'] as const),
) {}
