import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../users/dto/signup.dto';
import { SigninDto } from '../users/dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('signup')
    async signup(@Body(ValidationPipe) signupDto: SignupDto) {
        const user = await this.usersService.createUser(signupDto);
        return user;
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body(ValidationPipe) signinDto: SigninDto) {
        const user = await this.usersService.validateUser(signinDto);
        return this.authService.login(user);
    }
}
