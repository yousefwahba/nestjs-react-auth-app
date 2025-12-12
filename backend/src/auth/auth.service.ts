import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  login(user: UserDocument) {
    this.logger.log(`User login: ${user.email}`);
    const payload = { email: user.email, sub: user._id, name: user.name };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`JWT token generated for user: ${user.email}`);
    return {
      access_token: token,
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    };
  }
}
