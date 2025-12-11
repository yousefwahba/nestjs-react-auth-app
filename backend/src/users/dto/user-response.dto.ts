import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
    @Expose()
    _id: string;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
