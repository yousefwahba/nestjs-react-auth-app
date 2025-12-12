import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async login(user: UserDocument) {
        const payload = { email: user.email, sub: user._id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                email: user.email,
                name: user.name,
                _id: user._id,
            }
        };
    }
}
