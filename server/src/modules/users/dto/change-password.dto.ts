import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PASSWORD_MAX } from '../../../common/constants/validation.constants';
import { IsPassword } from '../../../common/decorators/validation.decorators';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'currentPassword is required' })
  @MaxLength(PASSWORD_MAX)
  currentPassword: string;

  @IsPassword('newPassword')
  newPassword: string;
}
