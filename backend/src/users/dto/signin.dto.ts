import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
    @ApiProperty({
        description: 'User email address',
        example: 'yousef@example.com',
        type: String,
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'SecureP@ss123',
        type: String,
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
