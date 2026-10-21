import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import {
  CursorPaginationDto,
  InterestPaginationDto,
} from '../../common/dto/pagination.dto';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import {
  beforeCursor,
  cursorOfId,
  Page,
  toPage,
} from '../../common/utils/pagination.util';
import { NotesService } from '../notes/notes.service';
import { PostsService } from '../posts/posts.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import { InterestGroup } from './interfaces/interest-group.interface';
import { PasswordService } from './password.service';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly passwordService: PasswordService,
    private readonly notesService: NotesService,
    private readonly postsService: PostsService,
  ) {}

  async create({ password, ...dto }: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create({
      ...dto,
      password: await this.passwordService.hash(password),
    });
  }

  async findPage({
    limit,
    cursor,
  }: CursorPaginationDto): Promise<Page<UserDocument[]>> {
    const users = await this.userModel
      .find(beforeCursor(cursor))
      .sort({ _id: -1 })
      .limit(limit + 1);
    return toPage(users, limit, cursorOfId);
  }

  async groupByInterests({
    limit,
    cursor,
  }: InterestPaginationDto): Promise<Page<InterestGroup[]>> {
    const afterInterest = { interests: { $gt: cursor ?? '' } };
    const groups = await this.userModel.aggregate<InterestGroup>([
      { $match: afterInterest },
      { $project: { name: 1, email: 1, interests: 1 } },
      { $unwind: '$interests' },
      { $match: afterInterest },
      {
        $group: {
          _id: '$interests',
          userCount: { $sum: 1 },
          users: { $push: { id: '$_id', name: '$name', email: '$email' } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          interest: '$_id',
          userCount: '$userCount',
          users: '$users',
        },
      },
    ]);
    return toPage(groups, limit, (group) => group.interest);
  }

  async findById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAuthUser(
    id: Types.ObjectId,
    tokenVersion: number,
  ): Promise<AuthUser | null> {
    const user = await this.userModel.findById(id, {
      role: 1,
      tokenVersion: 1,
    });
    return user?.tokenVersion === tokenVersion
      ? { id: user._id, role: user.role }
      : null;
  }

  findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).select('+password +tokenVersion');
  }

  async revokeSessions(id: Types.ObjectId): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { $inc: { tokenVersion: 1 } });
  }

  async update(
    id: Types.ObjectId,
    dto: UpdateUserDto,
    actor: AuthUser,
  ): Promise<UserDocument> {
    if (dto.role && dto.role !== actor.role && actor.id.equals(id)) {
      throw new ForbiddenException('You cannot change your own role');
    }
    const { password, ...changes } = dto;
    const update: UpdateQuery<User> = password
      ? {
          ...changes,
          password: await this.passwordService.hash(password),
          $inc: { tokenVersion: 1 },
        }
      : changes;
    return this.applyUpdate(id, update);
  }

  updateProfile(id: Types.ObjectId, dto: UpdateProfileDto) {
    return this.applyUpdate(id, dto);
  }

  async changePassword(
    id: Types.ObjectId,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<UserDocument> {
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'newPassword must differ from currentPassword',
      );
    }
    const user = await this.userModel
      .findById(id)
      .select('+password +tokenVersion');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const matches = await this.passwordService.verify(
      user.password,
      currentPassword,
    );
    if (!matches) {
      throw new BadRequestException('currentPassword is incorrect');
    }
    user.password = await this.passwordService.hash(newPassword);
    user.tokenVersion += 1;
    return user.save();
  }

  async remove(id: Types.ObjectId, actor: AuthUser): Promise<void> {
    if (actor.id.equals(id)) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await Promise.all([
      this.notesService.deleteByOwner(id),
      this.postsService.deleteByAuthor(id),
    ]);
  }

  private async applyUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<User>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
