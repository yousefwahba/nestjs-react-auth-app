import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data', () => {
      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      } as unknown as UserDocument;

      const result = service.login(mockUser);

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          email: 'test@example.com',
          name: 'Test User',
          _id: 'user-id-123',
        },
      });
    });

    it('should call jwtService.sign with correct payload', () => {
      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      } as unknown as UserDocument;

      service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'user-id-123',
        name: 'Test User',
      });
    });

    it('should generate unique tokens for different users', () => {
      mockJwtService.sign
        .mockReturnValueOnce('token-user-1')
        .mockReturnValueOnce('token-user-2');

      const user1 = {
        _id: 'user-1',
        email: 'user1@example.com',
        name: 'User One',
      } as unknown as UserDocument;

      const user2 = {
        _id: 'user-2',
        email: 'user2@example.com',
        name: 'User Two',
      } as unknown as UserDocument;

      const result1 = service.login(user1);
      const result2 = service.login(user2);

      expect(result1.access_token).toBe('token-user-1');
      expect(result2.access_token).toBe('token-user-2');
    });
  });
});
