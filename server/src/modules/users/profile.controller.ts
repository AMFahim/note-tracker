import { Body, Controller, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { NonEmptyBodyPipe } from '../../common/pipes/non-empty-body.pipe';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users/me')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  update(
    @CurrentUser() user: AuthUser,
    @Body(NonEmptyBodyPipe) dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
