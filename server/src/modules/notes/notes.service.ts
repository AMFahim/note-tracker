import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../../common/constants/role.enum';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { toObjectId } from '../../common/utils/object-id.util';
import {
  beforeCursor,
  cursorOfId,
  Page,
  toPage,
} from '../../common/utils/pagination.util';
import { AdminNotesQueryDto } from './dto/admin-notes-query.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<Note>,
  ) {}

  create(owner: Types.ObjectId, dto: CreateNoteDto): Promise<NoteDocument> {
    return this.noteModel.create({ ...dto, owner });
  }

  async findOwnPage(
    owner: Types.ObjectId,
    { limit, cursor }: CursorPaginationDto,
  ): Promise<Page<NoteDocument[]>> {
    const notes = await this.noteModel
      .find({ owner, ...beforeCursor(cursor) })
      .sort({ _id: -1 })
      .limit(limit + 1);
    return toPage(notes, limit, cursorOfId);
  }

  async findAllPage({
    limit,
    cursor,
    ownerId,
  }: AdminNotesQueryDto): Promise<Page<NoteDocument[]>> {
    const ownerFilter = ownerId ? { owner: toObjectId(ownerId) } : {};
    const notes = await this.noteModel
      .find({ ...ownerFilter, ...beforeCursor(cursor) })
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('owner', 'name email');
    return toPage(notes, limit, cursorOfId);
  }

  async findOne(id: Types.ObjectId, user: AuthUser): Promise<NoteDocument> {
    const filter =
      user.role === Role.Admin ? { _id: id } : { _id: id, owner: user.id };
    return this.orNotFound(await this.noteModel.findOne(filter));
  }

  async update(
    id: Types.ObjectId,
    owner: Types.ObjectId,
    dto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, owner },
      dto,
      { new: true, runValidators: true },
    );
    return this.orNotFound(note);
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId): Promise<void> {
    this.orNotFound(await this.noteModel.findOneAndDelete({ _id: id, owner }));
  }

  async deleteByOwner(owner: Types.ObjectId): Promise<void> {
    await this.noteModel.deleteMany({ owner });
  }

  private orNotFound(note: NoteDocument | null): NoteDocument {
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
}
