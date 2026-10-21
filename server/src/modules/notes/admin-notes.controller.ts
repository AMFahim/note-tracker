import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '../../common/constants/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminNotesQueryDto } from './dto/admin-notes-query.dto';
import { NotesService } from './notes.service';

@Controller('admin/notes')
@Roles(Role.Admin)
export class AdminNotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Query() query: AdminNotesQueryDto) {
    return this.notesService.findAllPage(query);
  }
}
