import { User } from '@entities/User.entity';

export interface UserAndAccessToken {
  user: User;
  accessToken: string;
}
