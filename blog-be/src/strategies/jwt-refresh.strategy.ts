import { User } from '@entities/User.entity';
import { CookieHelper } from '@helpers/cookie-helper';
import { TokenPayload } from '@interfaces/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@services/auth.service';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          if (
            request.headers.authorization &&
            typeof request.headers.authorization === 'string' &&
            request.headers.authorization.split(' ')[0] === 'Bearer'
          ) {
            return request.headers.authorization.split(' ')[1];
          }
          return request.cookies[configService.get('REFRESH_COOKIE_NAME')];
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: TokenPayload,
  ): Promise<User | undefined> {
    const { userId } = payload;
    if (
      request.headers.authorization &&
      typeof request.headers.authorization === 'string' &&
      request.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const refreshToken = request.headers.authorization.split(' ')[1];
      return await this.authService.getUserIfRefreshTokenMatches(
        refreshToken,
        userId,
      );
    }
    const refreshToken = CookieHelper.getRefreshTokenFromRequest(request);
    return await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
  }
}
