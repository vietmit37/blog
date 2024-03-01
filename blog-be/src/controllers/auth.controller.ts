import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@services/auth.service';
import RequestWithUser from '@interfaces/request-with-user.interface';
import { LoginDto } from '@dtos/auth/login.dto';
import { ICustomResponse } from '@interfaces/custom-response.interface';
import { UserAndTokens } from '@interfaces/user-and-tokens.interface';
import { UserService } from '@services/user.service';
import { UserAndAccessToken } from '@interfaces/user-and-access-tokens.interface';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';
import JwtAuthenticationGuard from '@guards/jwt.guard';
import { User } from '@entities/User.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async authentication(
    @Req() req: RequestWithUser,
  ): Promise<ICustomResponse<User>> {
    return {
      result: await this.authService.getUserAuth(req.user.id),
      message: 'Thành công!',
    };
  }
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() request: RequestWithUser,
  ): Promise<ICustomResponse<UserAndAccessToken>> {
    const { accessToken, accessCookie } =
      this.authService.getCookieWithJwtAccessToken(request.user.id);
    request.res.setHeader('Set-Cookie', [accessCookie]);

    return {
      result: { user: request.user, accessToken },
      message: 'Thành công!',
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  async logIn(
    @Req() request: RequestWithUser,
    @Body() loginDto: LoginDto,
  ): Promise<ICustomResponse<UserAndTokens>> {
    const { username, password } = loginDto;
    const user = await this.authService.getAuthenticatedUser(
      username,
      password,
    );

    const { accessCookie, accessToken } =
      this.authService.getCookieWithJwtAccessToken(user.id);
    const { refreshCookie, refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return {
      result: {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      message: 'Đăng nhập thành công!',
    };
  }

  @Get('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser): Promise<ICustomResponse> {
    const { accessCookie, refreshCookie } = this.authService.removeCookies();

    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    await this.authService.removeRefreshToken(request.user.id);

    return {
      result: undefined,
      message: 'Đăng xuất thành công!',
    };
  }
}
