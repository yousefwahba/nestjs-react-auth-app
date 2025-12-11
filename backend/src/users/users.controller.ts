import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Body(ValidationPipe) signupDto: SignupDto,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.createUser(signupDto);
        return plainToInstance(UserResponseDto, user.toObject(), {
            excludeExtraneousValues: true,
        });
    }
}
