import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ensureString } from '../common/pipes';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(signupDto: SignupDto): Promise<UserDocument> {
    const { email, password, name } = signupDto;
    this.logger.log(`Creating user with email: ${email}`);

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`Signup attempt with existing email: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    try {
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      this.logger.log(`User created successfully: ${email}`);
      return savedUser;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        this.logger.warn(`Duplicate email conflict: ${email}`);
        throw new ConflictException('User with this email already exists');
      }
      this.logger.error(`Error creating user: ${email}`, error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    // Defense-in-depth: ensure email is a string to prevent NoSQL injection
    const sanitizedEmail = ensureString(email).toLowerCase();
    this.logger.debug(`Finding user by email: ${sanitizedEmail}`);
    return this.userModel.findOne({ email: sanitizedEmail }).exec();
  }

  async validateUser(signinDto: SigninDto): Promise<UserDocument> {
    const { email, password } = signinDto;
    this.logger.log(`Validating user credentials for: ${email}`);
    const user = await this.findByEmail(email);

    if (!user) {
      this.logger.warn(`Login attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      this.logger.warn(`Invalid password attempt for: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User validated successfully: ${email}`);
    return user;
  }
}
