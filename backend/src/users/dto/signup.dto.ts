import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'yousef@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Yousef Wahba',
    minLength: 3,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description:
      'User password (must contain at least one letter, one number, and one special character)',
    example: 'SecureP@ss123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,})/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
