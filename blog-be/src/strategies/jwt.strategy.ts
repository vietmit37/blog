import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@interfaces/token-payload.interface';
import { User } from '@entities/User.entity';
import { AuthService } from '@services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
          return request.cookies[configService.get('ACCESS_COOKIE_NAME')];
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    return this.authService.getById(payload.userId);
  }
}
