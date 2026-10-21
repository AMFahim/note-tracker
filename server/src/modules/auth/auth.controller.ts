import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_THROTTLE,
} from '../../common/constants/auth.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { AppConfig } from '../../config/configuration';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService, AuthSession } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { extractToken } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;
  private readonly cookieMaxAge: number;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.cookieOptions = {
      httpOnly: true,
      secure: config.get('isProduction', { infer: true }),
      sameSite: 'lax',
      path: '/',
    };
    this.cookieMaxAge =
      config.get('jwt', { infer: true }).expiresInSeconds * 1000;
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.withCookie(response, await this.authService.register(dto));
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.withCookie(response, await this.authService.login(dto));
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(extractToken(request));
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.withCookie(
      response,
      await this.authService.changePassword(user.id, dto),
    );
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }

  private withCookie(response: Response, session: AuthSession) {
    response.cookie(ACCESS_TOKEN_COOKIE, session.accessToken, {
      ...this.cookieOptions,
      maxAge: this.cookieMaxAge,
    });
    return session;
  }
}
