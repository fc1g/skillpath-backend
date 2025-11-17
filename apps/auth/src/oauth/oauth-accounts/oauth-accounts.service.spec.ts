import { Test, TestingModule } from '@nestjs/testing';
import { OAuthAccountsService } from './oauth-accounts.service';
import { OAuthAccountsRepository } from './oauth-accounts.repository';
import {
	DEFAULT_TAKE,
	OAuthUser,
	POSTGRES_UNIQUE_VIOLATION,
	ProviderType,
	UpdateOAuthAccountDto,
	User,
} from '@app/common';
import {
	ConflictException,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';

type MockRepository = Record<keyof OAuthAccountsRepository, jest.Mock>;
const createMockOAuthAccountsRepository = (): MockRepository => ({
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
});

describe('OAuthAccountsService', () => {
	let service: OAuthAccountsService;
	let oauthAccountsRepository: MockRepository;

	const user: User = {
		id: '1',
		email: 'email',
		password: null,
		roles: [],
		oauthAccounts: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const oauthUser: OAuthUser = {
		provider: ProviderType.GOOGLE,
		providerId: 'id',
		email: 'email',
		username: 'username',
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OAuthAccountsService,
				{
					provide: OAuthAccountsRepository,
					useValue: createMockOAuthAccountsRepository(),
				},
			],
		}).compile();

		service = module.get<OAuthAccountsService>(OAuthAccountsService);
		oauthAccountsRepository = module.get<MockRepository>(
			OAuthAccountsRepository,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		describe('when payload is valid and oauth account does not exist', () => {
			it('should create and return a new account', async () => {
				// 	Arrange
				const expectedAccount = {};
				oauthAccountsRepository.create?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await service.create({
					userId: user.id,
					...oauthUser,
				});

				// 	Assert
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when account with the same provider already exists', () => {
			it('should throw ConflictException with a proper message', async () => {
				// 	Arrange
				oauthAccountsRepository.create?.mockRejectedValue({
					code: POSTGRES_UNIQUE_VIOLATION,
				});

				// 	Assert
				await expect(
					service.create({ userId: user.id, ...oauthUser }),
				).rejects.toBeInstanceOf(ConflictException);
				await expect(
					service.create({ userId: user.id, ...oauthUser }),
				).rejects.toThrow(
					'OAuth account with this provider and provider id already exists',
				);
			});
		});

		describe('when repository throws a non-unique constrains error', () => {
			it('should throw a generic InternalServerErrorException with a fallback message', async () => {
				// 	Arrange
				oauthAccountsRepository.create?.mockRejectedValue(
					new InternalServerErrorException(
						'Unable to create OAuthAccount, please try again later',
					),
				);
				// 	Assert
				await expect(
					service.create({ userId: user.id, ...oauthUser }),
				).rejects.toBeInstanceOf(InternalServerErrorException);
				await expect(
					service.create({ userId: user.id, ...oauthUser }),
				).rejects.toThrow(
					'Unable to create OAuthAccount, please try again later',
				);
			});
		});
	});

	describe('find', () => {
		it('should return an array of OAuthAccounts', async () => {
			// 	Arrange
			const expectedAccounts = [];
			oauthAccountsRepository.find?.mockResolvedValue(expectedAccounts);

			// 	Act
			const oauthAccounts = await service.find();

			// 	Assert
			expect(oauthAccountsRepository.find).toHaveBeenCalledWith(
				{},
				{
					take: DEFAULT_TAKE,
				},
			);
			expect(oauthAccounts).toEqual(expectedAccounts);
		});
	});

	describe('findOne', () => {
		describe('when oauth account exists', () => {
			it('should return the account', async () => {
				// 	Arrange
				const id = '1';
				const expectedAccount = {};
				oauthAccountsRepository.findOne?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await service.findOne(id);

				// 	Assert
				expect(oauthAccountsRepository.findOne).toHaveBeenCalledWith({ id });
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when oauth account does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				oauthAccountsRepository.findOne?.mockRejectedValue(
					new NotFoundException('OAuth account does not exist'),
				);

				// 	Assert
				await expect(service.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.findOne(id)).rejects.toThrow(
					'OAuth account does not exist',
				);
			});
		});
	});

	describe('update', () => {
		describe('when oauth account exists and updateOAuthAccountDto is valid', () => {
			it('should update the account with provided data', async () => {
				// 	Arrange
				const id = '1';
				const updateOAuthAccountDto: UpdateOAuthAccountDto = {};
				const expectedAccount = {};
				oauthAccountsRepository.update?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await service.update(id, updateOAuthAccountDto);

				// 	Assert
				expect(oauthAccountsRepository.update).toHaveBeenCalledWith(
					{ id },
					updateOAuthAccountDto,
				);
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when oauth account does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				const updateOAuthAccountDto: UpdateOAuthAccountDto = {};
				oauthAccountsRepository.update?.mockRejectedValue(
					new NotFoundException('OAuth account does not exist'),
				);

				// 	Assert
				await expect(
					oauthAccountsRepository.update(id, updateOAuthAccountDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(
					oauthAccountsRepository.update(id, updateOAuthAccountDto),
				).rejects.toThrow('OAuth account does not exist');
			});
		});
	});

	describe('remove', () => {
		describe('when oauth account exists', () => {
			it('should remove the account and return it', async () => {
				// 	Arrange
				const id = '1';
				const expected = {};
				oauthAccountsRepository.remove?.mockResolvedValue(expected);

				// 	Act
				const removed = await service.remove(id);

				// 	Assert
				expect(oauthAccountsRepository.remove).toHaveBeenCalledWith({ id });
				expect(removed).toEqual(expected);
			});
		});

		describe('when oauth account does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				oauthAccountsRepository.remove?.mockRejectedValue(
					new NotFoundException('OAuth account does not exist'),
				);

				// 	Assert
				await expect(service.remove(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.remove(id)).rejects.toThrow(
					'OAuth account does not exist',
				);
			});
		});
	});

	describe('preloadOAuthAccountByProvider', () => {
		describe('when oauth account exists', () => {
			it('should return the account', async () => {
				// 	Arrange
				const expectedAccount = {};
				oauthAccountsRepository.findOne?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await service.preloadOAuthAccountByProvider(
					user.id,
					oauthUser,
				);

				// 	Assert
				expect(oauthAccountsRepository.findOne).toHaveBeenCalledWith({
					provider: oauthUser.provider,
					providerId: oauthUser.providerId,
				});
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when oauth account does not exist', () => {
			it('should create and return newly created account', async () => {
				// 	Arrange
				const expectedAccount = {};
				oauthAccountsRepository.create?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await service.create({
					userId: user.id,
					...oauthUser,
				});

				// 	Assert
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});
	});
});
