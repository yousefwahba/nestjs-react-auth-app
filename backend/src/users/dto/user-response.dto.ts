import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: '507f1f77bcf86cd799439011',
    })
    @Expose()
    _id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'yousef@example.com',
    })
    @Expose()
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'Yousef Wahba',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: 'Account creation timestamp',
        example: '2025-12-12T10:00:00.000Z',
    })
    @Expose()
    createdAt: Date;

    @ApiProperty({
        description: 'Account last update timestamp',
        example: '2025-12-12T10:00:00.000Z',
    })
    @Expose()
    updatedAt: Date;
}
