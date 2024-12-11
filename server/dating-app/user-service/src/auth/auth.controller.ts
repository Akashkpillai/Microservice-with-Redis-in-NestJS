import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create.dto';
// import { User } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() data: CreateUserDto): Promise<{ message: string }> {
        return this.authService.register(data);
    }

    @Patch('mail-verification/:token')
    async verification(@Param('token') token: string): Promise<{ success: boolean }> {
        return this.authService.verifyMail(token);
    }

    @Post('login/email')
    async login(@Body() data: LoginEmailDto): Promise<{ access_token: string }> {
        return await this.authService.login(data);
    }

    @Post('login/otp')
    async sendOtp(@Body() data: { phone: string; otp: string }): Promise<{ access_token: string }> {
        return await this.authService.otpLogin(data);
    }
}
