import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import {
	ConflictException,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';

type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;
type MockJwtTokensService = Partial<Record<keyof JwtTokensService, jest.Mock>>;

const createMockUsersService = (): MockUsersService => ({
	create: jest.fn(),
	findOne: jest.fn(),
});
const createMockJwtTokensService = (): MockJwtTokensService => ({
	issuePairForUser: jest.fn(),
	verifyAndInvalidateRefresh: jest.fn(),
	rotate: jest.fn(),
});

describe('AuthService', () => {
	let service: AuthService;
	let usersService: MockUsersService;
	let jwtTokensService: MockJwtTokensService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: createMockUsersService(),
				},
				{
					provide: JwtTokensService,
					useValue: createMockJwtTokensService(),
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<MockUsersService>(UsersService);
		jwtTokensService = module.get<MockJwtTokensService>(JwtTokensService);
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
				const accessToken = 'access';
				const refreshToken = 'refresh';
				usersService.create?.mockResolvedValue({ id, ...createUserDto });
				jwtTokensService.issuePairForUser?.mockResolvedValue({
					accessToken,
					refreshToken,
				});

				// 	Act
				const tokens = await service.signup(createUserDto);

				// 	Assert
				expect(usersService.create).toHaveBeenCalledWith(createUserDto);
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
			oauthAccounts: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		it('should return signed tokens', async () => {
			// Arrange
			const accessToken = 'access';
			const refreshToken = 'refresh';
			jwtTokensService.issuePairForUser?.mockResolvedValue({
				accessToken,
				refreshToken,
			});

			// 	Act
			const tokens = await service.login(user);

			// 	Assert
			expect(tokens).toEqual({
				accessToken,
				refreshToken,
			});
		});
	});

	describe('logout', () => {
		const refreshTokenPayload: RefreshTokenPayloadInterface = {
			userId: '1',
			type: 'refresh',
			jti: 'jti',
		};

		it("should invalidate user's refresh token", async () => {
			// 	Arrange

			jwtTokensService.verifyAndInvalidateRefresh?.mockResolvedValue(undefined);

			// 	Act
			await service.logout(refreshTokenPayload);

			// 	Assert
			expect(jwtTokensService.verifyAndInvalidateRefresh).toHaveBeenCalledWith(
				refreshTokenPayload.userId,
				refreshTokenPayload.jti,
			);
		});
	});

	describe('rotateTokens', () => {
		const refreshTokenPayload: RefreshTokenPayloadInterface = {
			userId: '1',
			type: 'refresh',
			jti: 'refresh',
		};

		it('should return rotated tokens', async () => {
			// 	Arrange
			const accessToken = 'access';
			const refreshToken = 'refresh';
			usersService.findOne?.mockResolvedValue({
				id: refreshTokenPayload.userId,
				roles: [],
			});
			jwtTokensService.rotate?.mockResolvedValue({ accessToken, refreshToken });

			// 	Act
			const tokens = await service.rotateTokens(refreshTokenPayload);

			// 	Assert
			expect(usersService.findOne).toHaveBeenCalledWith(
				refreshTokenPayload.userId,
			);
			expect(tokens).toEqual({
				accessToken,
				refreshToken,
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
