import { IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Tên đăng nhập không hợp lệ!' })
  username: string;

  @IsString({ message: 'Mật khẩu không hợp lệ!' })
  password: string;
}
