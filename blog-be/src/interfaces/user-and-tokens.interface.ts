import { User } from '@entities/User.entity';

export interface UserAndTokens {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
