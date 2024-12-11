import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create.dto';
import { User } from './dto/user.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Patch(':id')
    async update(@Param('id') id: number, @Body() data: UpdateDto): Promise<{ message: string }> {
        return this.userService.update(id, data);
    }

    @Get()
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<boolean> {
        return this.userService.delete(id);
    }

    @Get('otp/:phone')
    async sendOtp(@Param('phone') phone: string) {
        return await this.userService.sendOtp(phone);
    }
}
