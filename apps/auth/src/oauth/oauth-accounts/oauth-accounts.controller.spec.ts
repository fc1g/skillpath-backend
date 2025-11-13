import { Test, TestingModule } from '@nestjs/testing';
import { OAuthAccountsService } from './oauth-accounts.service';
import { OAuthAccountsController } from './oauth-accounts.controller';
import { NotFoundException } from '@nestjs/common';
import { UpdateOAuthAccountDto } from '@app/common';

type MockOAuthAccountsService = Partial<
	Record<keyof OAuthAccountsService, jest.Mock>
>;
const createMockOAuthAccountsService = (): MockOAuthAccountsService => ({
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
});

describe('OAuthAccountsController', () => {
	let controller: OAuthAccountsController;
	let oauthAccountsService: MockOAuthAccountsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OAuthAccountsController],
			providers: [
				{
					provide: OAuthAccountsService,
					useValue: createMockOAuthAccountsService(),
				},
			],
		}).compile();

		controller = module.get<OAuthAccountsController>(OAuthAccountsController);
		oauthAccountsService =
			module.get<MockOAuthAccountsService>(OAuthAccountsService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should delegate to OAuthAccountsService.find and return oauth accounts list', async () => {
			// 	Arrange
			const expected = [];
			oauthAccountsService.find?.mockResolvedValue(expected);

			// 	Act
			const oauthAccounts = await controller.findAll();

			// 	Assert
			expect(oauthAccountsService.find).toHaveBeenCalled();
			expect(oauthAccounts).toEqual(expected);
		});
	});

	describe('findOne', () => {
		describe('when oauth account exists', () => {
			it('should call OAuthAccountsService.findOne and return the account', async () => {
				// 	Arrange
				const id = '1';
				const expectedAccount = {};
				oauthAccountsService.findOne?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await controller.findOne(id);

				// 	Assert
				expect(oauthAccountsService.findOne).toHaveBeenCalledWith(id);
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when OAuthAccountsService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				oauthAccountsService.findOne?.mockRejectedValue(
					new NotFoundException('OAuth account not found'),
				);

				// 	Assert
				await expect(controller.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.findOne(id)).rejects.toThrow(
					'OAuth account not found',
				);
			});
		});
	});

	describe('update', () => {
		describe('when oauth account exists and payload is valid', () => {
			it('should call OAuthAccountsService.update and return updated account', async () => {
				// 	Arrange
				const id = '1';
				const updateOAuthAccountDto: UpdateOAuthAccountDto = {};
				const expectedAccount = {};
				oauthAccountsService.update?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await controller.update(id, updateOAuthAccountDto);

				// 	Assert
				expect(oauthAccountsService.update).toHaveBeenCalledWith(
					id,
					updateOAuthAccountDto,
				);
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when OAuthAccountsService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				const updateOAuthAccountDto: UpdateOAuthAccountDto = {};
				oauthAccountsService.update?.mockRejectedValue(
					new NotFoundException('OAuth account not found'),
				);

				// 	Assert
				await expect(
					controller.update(id, updateOAuthAccountDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(
					controller.update(id, updateOAuthAccountDto),
				).rejects.toThrow('OAuth account not found');
			});
		});
	});

	describe('delete', () => {
		describe('when oauth account exists', () => {
			it('should call OAuthAccountsService.remove and return removed account', async () => {
				// 	Arrange
				const id = '1';
				const expectedAccount = {};
				oauthAccountsService.remove?.mockResolvedValue(expectedAccount);

				// 	Act
				const oauthAccount = await controller.delete(id);

				// 	Assert
				expect(oauthAccountsService.remove).toHaveBeenCalledWith(id);
				expect(oauthAccount).toEqual(expectedAccount);
			});
		});

		describe('when OAuthAccountsService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				oauthAccountsService.remove?.mockRejectedValue(
					new NotFoundException('OAuth account not found'),
				);

				// 	Assert
				await expect(controller.delete(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.delete(id)).rejects.toThrow(
					'OAuth account not found',
				);
			});
		});
	});
});
