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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { NonEmptyBodyPipe } from '../../common/pipes/non-empty-body.pipe';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findMine(@CurrentUser() user: AuthUser, @Query() query: CursorPaginationDto) {
    return this.notesService.findOwnPage(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateNoteDto) {
    return this.notesService.create(user.id, dto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() user: AuthUser,
  ) {
    return this.notesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() user: AuthUser,
    @Body(NonEmptyBodyPipe) dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() user: AuthUser,
  ) {
    return this.notesService.remove(id, user.id);
  }
}
