import { User } from '../entities/User.entity';

export interface UsersAndTotal {
  users: User[];
  total: number;
}
