import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  // Create a mock constructor function with proper typing
  const MockUserModelConstructor: jest.Mock & {
    findOne: jest.Mock;
  } = Object.assign(
    jest.fn().mockImplementation((data: Record<string, unknown>) => ({
      ...data,
      save: jest.fn().mockResolvedValue({
        _id: 'new-user-id',
        ...data,
      }),
    })),
    {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModelConstructor,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(MockUserModelConstructor.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return null if user not found', async () => {
      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should convert email to lowercase', async () => {
      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await service.findByEmail('TEST@EXAMPLE.COM');

      expect(MockUserModelConstructor.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('createUser', () => {
    const signupDto = {
      email: 'new@example.com',
      password: 'Password123!',
      name: 'New User',
    };

    beforeEach(() => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    });

    it('should create a new user successfully', async () => {
      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.createUser(signupDto);

      expect(result).toHaveProperty('_id', 'new-user-id');
      expect(result).toHaveProperty('email', 'new@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'new@example.com' }),
      });

      await expect(service.createUser(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUser', () => {
    const signinDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should return user if credentials are valid', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(signinDto);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.validateUser(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      MockUserModelConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
