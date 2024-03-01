import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/User.entity';
import bcrypt from 'bcrypt';
import { UsersAndTotal } from '@interfaces/users-and-total.interface';

@Injectable()
export class UserService {
  static BCRYPT_SALT = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<UsersAndTotal> {
    const [users, total] = await this.userRepository.findAndCount({
      order: { id: 'ASC' },
    });

    return {
      users,
      total,
    };
  }
  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      UserService.BCRYPT_SALT,
    );

    await this.updateRefreshHashedToken(userId, {
      hashedRefreshToken,
    });
  }
  private async updateRefreshHashedToken(
    userId: number,
    payload: Partial<User>,
  ): Promise<void> {
    await this.userRepository.update(userId, payload);
  }
}
