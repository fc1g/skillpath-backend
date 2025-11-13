import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oauth.service';
import { UsersService } from '../users/users.service';
import { OAuthAccountsService } from './oauth-accounts/oauth-accounts.service';
import { JwtTokensService } from '../jwt-tokens/jwt-tokens.service';
import { OAuthUser, ProviderType } from '@app/common';

type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;
type MockOAuthAccountsService = Partial<
	Record<keyof OAuthAccountsService, jest.Mock>
>;
type MockJwtTokensService = Partial<Record<keyof JwtTokensService, jest.Mock>>;

const createMockUsersService = (): MockUsersService => ({
	create: jest.fn(),
	preloadUserByEmail: jest.fn(),
});
const createMockOAuthAccountsService = (): MockOAuthAccountsService => ({
	create: jest.fn(),
	preloadOAuthAccountByProvider: jest.fn(),
});
const createMockJwtTokensService = (): MockJwtTokensService => ({
	issuePairForUser: jest.fn(),
});

describe('OAuthService', () => {
	let service: OAuthService;
	let usersService: MockUsersService;
	let oauthAccountsService: MockOAuthAccountsService;
	let jwtTokensService: MockJwtTokensService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OAuthService,
				{ provide: UsersService, useValue: createMockUsersService() },
				{
					provide: OAuthAccountsService,
					useValue: createMockOAuthAccountsService(),
				},
				{ provide: JwtTokensService, useValue: createMockJwtTokensService() },
			],
		}).compile();

		service = module.get<OAuthService>(OAuthService);
		usersService = module.get<MockUsersService>(UsersService);
		oauthAccountsService =
			module.get<MockOAuthAccountsService>(OAuthAccountsService);
		jwtTokensService = module.get<MockJwtTokensService>(JwtTokensService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('handleCallback', () => {
		const accessToken = 'access';
		const refreshToken = 'refresh';
		const oauthUser: OAuthUser = {
			provider: ProviderType.GOOGLE,
			providerId: 'id',
			email: 'email',
			username: 'username',
		};

		describe('when user and oauth account already exists', () => {
			it('should return signed tokens', async () => {
				// Arrange
				const expectedUser = {
					oauthAccounts: [],
				};
				const expectedOAuthAccount = {
					...oauthUser,
				};
				usersService.preloadUserByEmail?.mockResolvedValue(expectedUser);
				oauthAccountsService.preloadOAuthAccountByProvider?.mockResolvedValue(
					expectedOAuthAccount,
				);
				jwtTokensService.issuePairForUser?.mockResolvedValue({
					accessToken,
					refreshToken,
				});

				// Act
				const tokens = await service.handleCallback(oauthUser);

				// Assert
				expect(usersService.preloadUserByEmail).toHaveBeenCalledWith({
					email: oauthUser.email,
					password: null,
				});
				expect(
					oauthAccountsService.preloadOAuthAccountByProvider,
				).toHaveBeenCalledWith(expectedUser, oauthUser);
				expect(tokens).toEqual({ accessToken, refreshToken });
			});
		});
	});
});
