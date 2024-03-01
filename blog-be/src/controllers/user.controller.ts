import { Controller, Get } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { ICustomResponse } from '@interfaces/custom-response.interface';
import { UsersAndTotal } from '@interfaces/users-and-total.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<ICustomResponse<UsersAndTotal>> {
    return {
      message: 'Thành công!',
      result: await this.userService.findAll(),
    };
  }
}
