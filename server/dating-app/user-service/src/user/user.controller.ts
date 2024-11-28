import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { User } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  async create(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }
}
