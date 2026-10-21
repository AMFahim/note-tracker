import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../common/constants/role.enum';
import {
  IsEmailAddress,
  IsInterestList,
  IsName,
  IsPassword,
} from '../../../common/decorators/validation.decorators';

export class RegisterUserDto {
  @IsName()
  name: string;

  @IsEmailAddress()
  email: string;

  @IsPassword()
  password: string;

  @IsOptional()
  @IsInterestList()
  interests?: string[];
}

export class CreateUserDto extends RegisterUserDto {
  @IsOptional()
  @IsEnum(Role, { message: 'role must be user or admin' })
  role?: Role;
}
