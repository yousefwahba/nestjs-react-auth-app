import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../users/dto/signup.dto';
import { SigninDto } from '../users/dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Register a new user with email, name, and password. Returns JWT token upon successful registration.',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          email: 'yousef@example.com',
          name: 'Yousef Wahba',
          _id: '693c209e4c9864c0bf4ad692',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation error or duplicate email',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Please provide a valid email address',
          'Password must contain at least one letter, one number, and one special character',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    const user = await this.usersService.createUser(signupDto);
    return this.authService.login(user);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in to existing account',
    description:
      'Authenticate user with email and password. Returns JWT token upon successful authentication.',
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          email: 'yousef@example.com',
          name: 'Yousef Wahba',
          _id: '693c209e4c9864c0bf4ad692',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Please provide a valid email address',
          'Password is required',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async signin(@Body(ValidationPipe) signinDto: SigninDto) {
    const user = await this.usersService.validateUser(signinDto);
    return this.authService.login(user);
  }
}
