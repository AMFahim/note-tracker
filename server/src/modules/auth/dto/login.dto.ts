import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PASSWORD_MAX } from '../../../common/constants/validation.constants';
import { TrimLowerCase } from '../../../common/decorators/transform.decorators';

export class LoginDto {
  @TrimLowerCase()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MaxLength(PASSWORD_MAX)
  password: string;
}
