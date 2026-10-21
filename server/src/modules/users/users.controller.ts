import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Role } from '../../common/constants/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CursorPaginationDto,
  InterestPaginationDto,
} from '../../common/dto/pagination.dto';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { NonEmptyBodyPipe } from '../../common/pipes/non-empty-body.pipe';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Roles(Role.Admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: CursorPaginationDto) {
    return this.usersService.findPage(query);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('interests')
  groupByInterests(@Query() query: InterestPaginationDto) {
    return this.usersService.groupByInterests(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body(NonEmptyBodyPipe) dto: UpdateUserDto,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.usersService.update(id, dto, actor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.usersService.remove(id, actor);
  }
}
