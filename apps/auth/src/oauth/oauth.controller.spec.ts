import { Test, TestingModule } from '@nestjs/testing';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthUser, ProviderType } from '@app/common';

type MockOAuthService = Partial<Record<keyof OAuthService, jest.Mock>>;
const createMockOAuthService = (): MockOAuthService => ({
	handleCallback: jest.fn(),
});

describe('OAuthController', () => {
	let controller: OAuthController;
	let oauthService: MockOAuthService;

	const accessToken = 'access';
	const refreshToken = 'refresh';
	const oauthUser: OAuthUser = {
		provider: ProviderType.GITHUB,
		providerId: 'id',
		email: 'email',
		username: 'username',
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OAuthController],
			providers: [
				{ provide: OAuthService, useValue: createMockOAuthService() },
			],
		}).compile();

		controller = module.get<OAuthController>(OAuthController);
		oauthService = module.get<MockOAuthService>(OAuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('githubCallback', () => {
		it('should register new oauth account to user and return signed tokens', async () => {
			// 	Arrange
			oauthService.handleCallback?.mockResolvedValue({
				accessToken,
				refreshToken,
			});

			// 	Act
			const tokens = await controller.githubCallback(oauthUser);

			// 	Assert
			expect(tokens).toEqual({ accessToken, refreshToken });
		});
	});

	describe('googleCallback', () => {
		it('should register new oauth account to user and return signed tokens', async () => {
			// 	Arrange
			oauthService.handleCallback?.mockResolvedValue({
				accessToken,
				refreshToken,
			});

			// 	Act
			const tokens = await controller.googleCallback(oauthUser);

			// 	Assert
			expect(tokens).toEqual({ accessToken, refreshToken });
		});
	});
});
