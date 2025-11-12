import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import { randomUUID } from 'crypto';
import { ConflictException } from '@nestjs/common';

type MockAuthService = Partial<Record<keyof AuthService, jest.Mock>>;

const createMockAuthService = (): MockAuthService => ({
	signup: jest.fn(),
	login: jest.fn(),
	logout: jest.fn(),
	rotateTokens: jest.fn(),
});

describe('AuthController', () => {
	let authController: AuthController;
	let authService: MockAuthService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: createMockAuthService(),
				},
			],
		}).compile();

		authController = app.get<AuthController>(AuthController);
		authService = app.get<MockAuthService>(AuthService);
	});

	describe('root', () => {
		it('should be defined', () => {
			expect(authController).toBeDefined();
		});
	});

	describe('signup', () => {
		const createUserDto: CreateUserDto = {
			email: 'example@gmail.com',
			password: 'strongPass1234!',
		};

		describe('when payload is valid', () => {
			it('should delegate AuthService.signup and return signed tokens', async () => {
				// 	Arrange
				const expectedTokens = {
					accessToken: randomUUID(),
					refreshToken: randomUUID(),
				};
				authService.signup?.mockResolvedValue(expectedTokens);

				// 	Act
				const tokens = await authController.signup(createUserDto);

				// 	Assert
				expect(authService.signup).toHaveBeenCalledWith(createUserDto);
				expect(tokens).toEqual(expectedTokens);
			});
		});

		describe('when service throws ConflictException', () => {
			it('should propagate ConflictException', async () => {
				// 	Arrange
				authService.signup?.mockRejectedValue(
					new ConflictException('User with this email already exists'),
				);

				// 	Assert
				await expect(authService.signup).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(authController.signup(createUserDto)).rejects.toThrow(
					'User with this email already exists',
				);
			});
		});
	});

	describe('login', () => {
		describe('when user exists', () => {
			it('should delegate AuthService.login and return signed tokens', async () => {
				// 	Arrange
				const user: User = {
					id: '1',
					email: 'email',
					password: 'password',
					roles: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				const expectedTokens = {
					accessToken: randomUUID(),
					refreshToken: randomUUID(),
				};
				authService.login?.mockResolvedValue(expectedTokens);

				// 	Act
				const tokens = await authController.login(user);

				// 	Assert
				expect(authService.login).toHaveBeenCalledWith(user);
				expect(tokens).toEqual(expectedTokens);
			});
		});
	});

	describe('logout', () => {
		describe('when payload is valid', () => {
			it('should delegate AuthService.logout', async () => {
				// 	Arrange
				const refreshTokenPayload: RefreshTokenPayloadInterface = {
					userId: '1',
					type: 'refresh',
					jti: randomUUID(),
				};
				authService.logout?.mockResolvedValue(true);

				// 	Act
				await authController.logout(refreshTokenPayload);

				// 	Assert
				expect(authService.logout).toHaveBeenCalledWith(refreshTokenPayload);
			});
		});
	});

	describe('refresh', () => {
		describe('when payload is valid', () => {
			it('should delegate AuthService.refresh and return rotated tokens', async () => {
				// 	Arrange
				const refreshTokenPayload: RefreshTokenPayloadInterface = {
					userId: '1',
					type: 'refresh',
					jti: randomUUID(),
				};
				const expectedTokens = {
					accessToken: randomUUID(),
					refreshToken: randomUUID(),
				};
				authService.rotateTokens?.mockResolvedValue(expectedTokens);

				// 	Act
				const tokens = await authController.refresh(refreshTokenPayload);

				// 	Assert
				expect(authService.rotateTokens).toHaveBeenCalledWith(
					refreshTokenPayload,
				);
				expect(tokens).toEqual(expectedTokens);
			});
		});
	});
});
