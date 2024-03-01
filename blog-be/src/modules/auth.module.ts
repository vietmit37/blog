import { User } from '@entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@controllers/auth.controller';
import { JwtStrategy } from '@strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@services/user.service';
import { JwtRefreshTokenStrategy } from '@strategies/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, JwtRefreshTokenStrategy],
})
export class AuthModule {}
