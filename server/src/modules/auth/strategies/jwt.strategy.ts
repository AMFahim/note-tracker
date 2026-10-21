import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE } from '../../../common/constants/auth.constants';
import {
  AuthUser,
  JwtPayload,
} from '../../../common/interfaces/auth-user.interface';
import { AppConfig } from '../../../config/configuration';
import { AuthService } from '../auth.service';

const fromCookie = (request: Request): string | null => {
  const cookies = request.cookies as Record<string, string | undefined>;
  return cookies[ACCESS_TOKEN_COOKIE] ?? null;
};

export const extractToken = ExtractJwt.fromExtractors([
  fromCookie,
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<AppConfig, true>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: extractToken,
      secretOrKey: config.get('jwt', { infer: true }).secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.authService.authenticate(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
