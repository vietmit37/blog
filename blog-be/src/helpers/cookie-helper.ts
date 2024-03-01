import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

const configService = new ConfigService();

export class CookieHelper {
  static getAccessTokenFromRequest(request: Request): string {
    const { cookies } = request;
    return cookies[configService.get('ACCESS_COOKIE_NAME')];
  }

  static getRefreshTokenFromRequest(request: Request): string {
    const { cookies } = request;
    return cookies[configService.get('REFRESH_COOKIE_NAME')];
  }
}
