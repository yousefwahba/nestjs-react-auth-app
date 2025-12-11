import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/((?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,})/, { message: 'Password must contain at least one letter, one number, and one special character' })
    password: string;
}
