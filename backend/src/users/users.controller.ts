import {
    Controller,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ 
        summary: 'Get current user profile',
        description: 'Retrieve the authenticated user\'s profile information. Requires valid JWT token.',
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Profile retrieved successfully',
        schema: {
            example: {
                "_id": "693c209e4c9864c0bf4ad692",
                "email": "yousef@example.com",
                "name": "Yousef Wahba"
              }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Missing or invalid token',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized'
            }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    getMyProfile(@Request() req) {
        return req.user;
    }
}