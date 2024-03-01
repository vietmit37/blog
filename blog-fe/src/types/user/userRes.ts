export interface IUserRes {
  id: number;
  username: string;
  password: string;
  email: string;
  avatarUrl: string;
  fullName: string;
  phone: string;
  address: string;
  dob: string;
  gender: number;
  activityStatus: null;
  avatarImage: string | null;
  hashedRefreshToken: string | null;
  type: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAndAccessToken {
  accessToken: string;
  user: IUserRes;
}
