import { Test, TestingModule } from '@nestjs/testing';
import { JwtTokensService } from './jwt-tokens.service';
import { JwtService } from '@nestjs/jwt';
import {
	InvalidatedRefreshTokenError,
	RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { ACCESS_JWT } from './config/access-jwt.config';
import { REFRESH_JWT } from './config/refresh-jwt.config';
import { User } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';

type MockTokensStorage = Record<keyof RefreshTokenIdsStorage, jest.Mock>;
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

describe('JwtTokensService', () => {
	let service: JwtTokensService;
	let storage: MockTokensStorage;
	let accessJwt: jest.Mocked<JwtService>;
	let refreshJwt: jest.Mocked<JwtService>;

	const user: User = {
		id: '1',
		email: 'email',
		password: 'password',
		roles: [],
		oauthAccounts: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtTokensService,
				{
					provide: RefreshTokenIdsStorage,
					useValue: createMockTokensStorage(),
				},
				{ provide: ACCESS_JWT, useValue: mockJwt() },
				{ provide: REFRESH_JWT, useValue: mockJwt() },
			],
		}).compile();

		service = module.get<JwtTokensService>(JwtTokensService);
		storage = module.get<MockTokensStorage>(RefreshTokenIdsStorage);
		accessJwt = module.get(ACCESS_JWT);
		refreshJwt = module.get(REFRESH_JWT);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('issuePairForUser', () => {
		it('should issue access and refresh tokens for a user', async () => {
			// 	Arrange
			accessJwt.signAsync.mockResolvedValue('access');
			refreshJwt.signAsync.mockResolvedValue('refresh');

			// 	Act
			const tokens = await service.issuePairForUser(user);

			// 	Assert
			expect(accessJwt.signAsync).toHaveBeenCalledWith({
				userId: user.id,
				roles: user.roles,
				type: 'access',
			});
			expect(refreshJwt.signAsync).toHaveBeenCalledWith({
				userId: user.id,
				type: 'refresh',
				jti: expect.any(String) as string,
			});
			expect(tokens).toEqual({
				accessToken: 'access',
				refreshToken: 'refresh',
			});
		});
	});

	describe('verifyAndInvalidateRefresh', () => {
		describe('when storage.validate returns true', () => {
			it('invalidates the refresh session', async () => {
				// 	Arrange
				const jti = 'jti';
				storage.validate.mockResolvedValue(true);

				// 	Act
				await service.verifyAndInvalidateRefresh(user.id, jti);

				// 	Assert
				expect(storage.validate).toHaveBeenCalledWith(user.id, jti);
				expect(storage.invalidate).toHaveBeenCalledWith(user.id);
			});
		});

		describe('when wrong token provided', () => {
			it('propagate UnauthorizedException', async () => {
				// 	Arrange
				const jti = 'jti';
				storage.validate.mockRejectedValue(
					new InvalidatedRefreshTokenError('MISMATCH'),
				);

				// 	Assert
				await expect(
					service.verifyAndInvalidateRefresh(user.id, jti),
				).rejects.toBeInstanceOf(UnauthorizedException);
				await expect(
					service.verifyAndInvalidateRefresh(user.id, jti),
				).rejects.toThrow('Refresh token invalid: MISMATCH');
				expect(storage.invalidate).not.toHaveBeenCalled();
			});
		});

		describe('when token was not provided', () => {
			it('propagate UnauthorizedException', async () => {
				// 	Arrange
				const jti = '';
				storage.validate.mockRejectedValue(
					new InvalidatedRefreshTokenError('MISSING'),
				);

				// 	Assert
				await expect(
					service.verifyAndInvalidateRefresh(user.id, jti),
				).rejects.toBeInstanceOf(UnauthorizedException);
				await expect(
					service.verifyAndInvalidateRefresh(user.id, jti),
				).rejects.toThrow('Refresh token invalid: MISSING');
			});
		});
	});

	describe('rotate', () => {
		describe('when the old refresh is valid', () => {
			it('verifies, invalidates, issues a new pair, and stores a new JTI', async () => {
				// Arrange
				const jti = 'old-jti';
				storage.validate?.mockResolvedValue(true);
				accessJwt.signAsync?.mockResolvedValue('access');
				refreshJwt.signAsync?.mockResolvedValue('refresh');

				// 	Act
				const tokens = await service.rotate(user, jti);

				// 	Assert
				expect(storage.validate).toHaveBeenCalledWith('1', jti);
				expect(storage.invalidate).toHaveBeenCalledWith('1');

				expect(accessJwt.signAsync).toHaveBeenCalledWith({
					userId: user.id,
					type: 'access',
					roles: user.roles,
				});
				expect(refreshJwt.signAsync).toHaveBeenCalledWith({
					userId: user.id,
					type: 'refresh',
					jti: expect.any(String) as string,
				});

				expect(tokens).toEqual({
					accessToken: 'access',
					refreshToken: 'refresh',
				});
			});
		});

		describe('when the old refresh was already invalidated', () => {
			it('propagates UnauthorizedException and does not issue new tokens', async () => {
				// 	Arrange
				const jti = 'old-jti';
				storage.validate.mockRejectedValue(
					new InvalidatedRefreshTokenError('MISMATCH'),
				);

				// 	Assert
				await expect(service.rotate(user, jti)).rejects.toBeInstanceOf(
					UnauthorizedException,
				);
				expect(accessJwt.signAsync).not.toHaveBeenCalled();
				expect(refreshJwt.signAsync).not.toHaveBeenCalled();
				expect(storage.insert).not.toHaveBeenCalled();
			});
		});
	});
});
