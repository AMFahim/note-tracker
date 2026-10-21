import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { Role } from '../../common/constants/role.enum';
import {
  AuthUser,
  JwtPayload,
} from '../../common/interfaces/auth-user.interface';
import {
  isObjectIdString,
  toObjectId,
} from '../../common/utils/object-id.util';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { PasswordService } from '../users/password.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

export interface AuthSession {
  user: UserDocument;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthSession> {
    const user = await this.usersService.create({ ...dto, role: Role.User });
    return this.startSession(user);
  }

  async login({ email, password }: LoginDto): Promise<AuthSession> {
    const user = await this.usersService.findByEmailWithPassword(email);
    const matches = await this.passwordService.verifyTimingSafe(
      user?.password,
      password,
    );
    if (!user || !matches) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.startSession(user);
  }

  async changePassword(
    id: Types.ObjectId,
    dto: ChangePasswordDto,
  ): Promise<AuthSession> {
    return this.startSession(await this.usersService.changePassword(id, dto));
  }

  async logout(token: string | null): Promise<void> {
    const payload = token
      ? await this.jwtService.verifyAsync<JwtPayload>(token).catch(() => null)
      : null;
    const user = payload ? await this.authenticate(payload) : null;
    if (user) {
      await this.usersService.revokeSessions(user.id);
    }
  }

  authenticate({ sub, ver }: JwtPayload): Promise<AuthUser | null> {
    if (!isObjectIdString(sub) || !Number.isInteger(ver)) {
      return Promise.resolve(null);
    }
    return this.usersService.findAuthUser(toObjectId(sub), ver);
  }

  private async startSession(user: UserDocument): Promise<AuthSession> {
    const payload: JwtPayload = {
      sub: user._id.toHexString(),
      ver: user.tokenVersion,
    };
    return { user, accessToken: await this.jwtService.signAsync(payload) };
  }
}
