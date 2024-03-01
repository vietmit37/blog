import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { ICookieAccessToken } from '@interfaces/cookie-access.interface';
import { TokenPayload } from '@interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ICookieRefreshToken } from '@interfaces/cookie-refresh.interface';
import { ICookies } from '@interfaces/cookies.interface';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getAuthenticatedUser(
    username: string,
    password: string,
  ): Promise<User> {
    let user: User;
    if (isEmail(username)) {
      user = await this.userRepository.findOne({
        where: {
          email: username,
        },
      });
    } else {
      user = await this.userRepository.findOne({
        where: {
          username,
        },
      });
    }

    if (!user) {
      throw new HttpException('Không tồn tại tài khoản!', HttpStatus.NOT_FOUND);
    }

    if (!(await this.verifyPassword(user.password, password))) {
      throw new HttpException(
        `Sai tên đăng nhập hoặc mật khẩu!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async verifyPassword(
    encryptedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, encryptedPassword);
  }

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ): ICookieAccessToken {
    const payload: TokenPayload = {
      userId,
      isSecondFactorAuthenticated,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return {
      accessToken: token,
      accessCookie: `${this.configService.get(
        'ACCESS_COOKIE_NAME',
      )}=${token}; HttpOnly; SameSite=none; Secure; Path=/; Max-Age=${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    };
  }

  public getCookieWithJwtRefreshToken(userId: number): ICookieRefreshToken {
    const payload: TokenPayload = {
      userId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `${this.configService.get(
      'REFRESH_COOKIE_NAME',
    )}=${token}; HttpOnly; SameSite=none; Secure; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      refreshCookie: cookie,
      refreshToken: token,
    };
  }

  async getById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
  async getUserAuth(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) return user;
    else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) return undefined;

    if (await bcrypt.compare(refreshToken, user.hashedRefreshToken)) {
      return user;
    }

    return undefined;
  }

  public removeCookies(): ICookies {
    const accessCookie = `${this.configService.get(
      'ACCESS_COOKIE_NAME',
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;

    const refreshCookie = `${this.configService.get(
      'REFRESH_COOKIE_NAME',
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;

    return {
      accessCookie,
      refreshCookie,
    };
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.updateRefreshHashedToken(userId, {
      hashedRefreshToken: null,
    });
  }
  async updateRefreshHashedToken(
    userId: number,
    payload: QueryPartialEntity<User>,
  ): Promise<void> {
    await this.userRepository.update(userId, payload);
  }
}
