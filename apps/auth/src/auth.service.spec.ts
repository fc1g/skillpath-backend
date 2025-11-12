import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { REFRESH_JWT } from './config/refresh-jwt.config';
import { ACCESS_JWT } from './config/access-jwt.config';
import {
	InvalidatedRefreshTokenError,
	RefreshTokenIdsStorage,
} from './storages/refresh-token-ids.storage';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import { randomUUID } from 'crypto';
import {
	ConflictException,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;
type MockTokensStorage = Record<keyof RefreshTokenIdsStorage, jest.Mock>;

const createMockUsersService = (): MockUsersService => ({
	create: jest.fn(),
	findOne: jest.fn(),
});

const createMockTokensStorage = (): MockTokensStorage => ({
	insert: jest.fn(),
	invalidate: jest.fn(),
	validate: jest.fn(),
});

const mockJwt = (): Partial<jest.Mocked<JwtService>> => ({
	sign: jest.fn(),
	signAsync: jest.fn(),
	verify: jest.fn(),
	verifyAsync: jest.fn(),
	decode: jest.fn(),
});

describe('AuthService', () => {
	let service: AuthService;
	let usersService: MockUsersService;
	let storage: MockTokensStorage;
	let accessJwt: jest.Mocked<JwtService>;
	let refreshJwt: jest.Mocked<JwtService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: createMockUsersService(),
				},
				{
					provide: RefreshTokenIdsStorage,
					useValue: createMockTokensStorage(),
				},
				{ provide: ACCESS_JWT, useValue: mockJwt() },
				{ provide: REFRESH_JWT, useValue: mockJwt() },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<MockUsersService>(UsersService);
		storage = module.get<MockTokensStorage>(RefreshTokenIdsStorage);
		accessJwt = module.get(ACCESS_JWT);
		refreshJwt = module.get(REFRESH_JWT);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('signup', () => {
		const createUserDto: CreateUserDto = {
			email: 'example@gmail.com',
			password: 'strongPass1234!',
		};

		describe('when user does not exist', () => {
			it('should create new user and return signed tokens', async () => {
				// 	Arrange
				const id = '1';
				const accessToken = randomUUID();
				const refreshToken = randomUUID();
				usersService.create?.mockResolvedValue({ id, ...createUserDto });
				accessJwt.signAsync?.mockResolvedValue(accessToken);
				refreshJwt.signAsync?.mockResolvedValue(refreshToken);

				// 	Act
				const tokens = await service.signup(createUserDto);

				// 	Assert
				expect(usersService.create).toHaveBeenCalledWith(createUserDto);
				expect(storage.insert).toHaveBeenCalledTimes(1);
				expect(tokens).toEqual({
					accessToken,
					refreshToken,
				});
			});
		});

		describe('when user with the same email already exists', () => {
			it('should throw ConflictException', async () => {
				// 	Arrange
				usersService.create?.mockRejectedValue(
					new ConflictException('User with this email already exists'),
				);

				// 	Assert
				expect(storage.insert).toHaveBeenCalledTimes(0);
				await expect(service.signup(createUserDto)).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(service.signup(createUserDto)).rejects.toThrow(
					'User with this email already exists',
				);
			});
		});

		describe('when users service throws a non-unique constraints error', () => {
			it('should throw a generic InternalServerErrorException with a fallback message', async () => {
				// 	Arrange
				usersService.create?.mockRejectedValue(
					new InternalServerErrorException(
						'Unable to create user, please try again later',
					),
				);

				// 	Assert
				await expect(service.signup(createUserDto)).rejects.toBeInstanceOf(
					InternalServerErrorException,
				);
				await expect(service.signup(createUserDto)).rejects.toThrow(
					'Unable to create user, please try again later',
				);
			});
		});
	});

	describe('login', () => {
		const user: User = {
			id: '1',
			email: 'email',
			password: 'password',
			roles: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		describe('when user is valid', () => {
			it('should return signed tokens', async () => {
				// Arrange
				const accessToken = randomUUID();
				const refreshToken = randomUUID();
				accessJwt.signAsync?.mockResolvedValue(accessToken);
				refreshJwt.signAsync?.mockResolvedValue(refreshToken);

				// 	Act
				const tokens = await service.login(user);

				// 	Assert
				expect(storage.insert).toHaveBeenCalledTimes(1);
				expect(tokens).toEqual({
					accessToken,
					refreshToken,
				});
			});
		});
	});

	describe('logout', () => {
		const refreshTokenPayload: RefreshTokenPayloadInterface = {
			userId: '1',
			type: 'refresh',
			jti: randomUUID(),
		};

		describe('when refreshTokenPayload is valid', () => {
			it("should invalidate user's refresh token", async () => {
				// 	Arrange
				storage.validate?.mockResolvedValue(true);

				// 	Act
				await service.logout(refreshTokenPayload);

				// 	Assert
				expect(storage.validate).toHaveBeenCalledWith(
					refreshTokenPayload.userId,
					refreshTokenPayload.jti,
				);
				expect(storage.invalidate).toHaveBeenCalledWith(
					refreshTokenPayload.userId,
				);
			});
		});

		describe('when refreshTokenPayload is invalid', () => {
			it('should throw UnauthorizedException', async () => {
				// 	Arrange
				storage.validate?.mockRejectedValue(
					new InvalidatedRefreshTokenError('MISSING'),
				);

				// 	Assert
				await expect(
					service.logout(refreshTokenPayload),
				).rejects.toBeInstanceOf(UnauthorizedException);
				await expect(service.logout(refreshTokenPayload)).rejects.toThrow(
					'Refresh token invalid: MISSING',
				);
			});
		});
	});

	describe('rotateTokens', () => {
		const refreshTokenPayload: RefreshTokenPayloadInterface = {
			userId: '1',
			type: 'refresh',
			jti: randomUUID(),
		};

		describe('when refreshTokenPayload is valid', () => {
			it('should return rotated tokens', async () => {
				// 	Arrange
				const accessToken = randomUUID();
				const refreshToken = randomUUID();
				accessJwt.signAsync?.mockResolvedValue(accessToken);
				refreshJwt.signAsync?.mockResolvedValue(refreshToken);
				usersService.findOne?.mockResolvedValue({
					id: refreshTokenPayload.userId,
					roles: [],
				});
				storage.validate?.mockResolvedValue(true);

				// 	Act
				const tokens = await service.rotateTokens(refreshTokenPayload);

				// 	Assert
				expect(storage.validate).toHaveBeenCalledWith(
					refreshTokenPayload.userId,
					refreshTokenPayload.jti,
				);
				expect(storage.invalidate).toHaveBeenCalledWith(
					refreshTokenPayload.userId,
				);
				expect(tokens).toEqual({
					accessToken,
					refreshToken,
				});
			});
		});

		describe('when refreshTokenPayload is invalid', () => {
			it('should throw UnauthorizedException', async () => {
				// 	Arrange
				usersService.findOne?.mockResolvedValue({
					id: refreshTokenPayload.userId,
					roles: [],
				});
				storage.validate?.mockRejectedValue(
					new InvalidatedRefreshTokenError('MISMATCH'),
				);

				// 	Assert
				await expect(
					service.logout(refreshTokenPayload),
				).rejects.toBeInstanceOf(UnauthorizedException);
				await expect(service.logout(refreshTokenPayload)).rejects.toThrow(
					'Refresh token invalid: MISMATCH',
				);
			});
		});

		describe('when user does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				usersService.findOne?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(
					service.rotateTokens(refreshTokenPayload),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(service.rotateTokens(refreshTokenPayload)).rejects.toThrow(
					'User not found',
				);
			});
		});
	});
});
