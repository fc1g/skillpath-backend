import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { Role, RoleType, UpdateUserDto, UpdateUserRolesDto } from '@app/common';

type MockService = Partial<Record<keyof UsersService, jest.Mock>>;

const createMockService = (): MockService => ({
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	updateUserRoles: jest.fn(),
	remove: jest.fn(),
});

describe('UsersController', () => {
	let controller: UsersController;
	let usersService: MockService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [{ provide: UsersService, useValue: createMockService() }],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		usersService = module.get<MockService>(UsersService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		describe('when UsersService.find returns roles', () => {
			it('should call UsersService.find and return a list of users', async () => {
				// 	Arrange
				const expected = [{ id: '1' }];
				usersService.find?.mockResolvedValue(expected);

				// 	Act
				const users = await controller.findAll();

				// 	Assert
				expect(usersService.find).toHaveBeenCalled();
				expect(users).toEqual(expected);
			});
		});
	});

	describe('findOne', () => {
		describe('when user with given id exists', () => {
			it('should call UsersService.findOne and return the user', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = { id };
				usersService.findOne?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await controller.findOne(id);

				// 	Assert
				expect(usersService.findOne).toHaveBeenCalledWith(id);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when UsersService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersService.findOne?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(controller.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.findOne(id)).rejects.toThrow('User not found');
			});
		});
	});

	describe('update', () => {
		describe('when user exists and payload is valid', () => {
			it('should call UsersService.update and return updated user', async () => {
				// 	Arrange
				const id = '1';
				const updateUserDto: UpdateUserDto = {};
				const expectedUser = { id, ...updateUserDto };
				usersService.update?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await controller.update(id, updateUserDto);

				// 	Assert
				expect(usersService.update).toHaveBeenCalledWith(id, updateUserDto);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when UsersService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				const updateUserDto: UpdateUserDto = {};
				usersService.update?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(
					controller.update(id, updateUserDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(controller.update(id, updateUserDto)).rejects.toThrow(
					'User not found',
				);
			});
		});
	});

	describe('updateUserRoles', () => {
		const updateUserRolesDto: UpdateUserRolesDto = {
			add: [RoleType.ADMIN],
			remove: [RoleType.ADMIN],
		};
		const currentRoles: Role[] = [
			{
				id: '1',
				name: RoleType.USER,
				users: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		describe('when user exists and payload is valid', () => {
			it('should call UsersService.updateUserRoles and return updated user', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = { id, currentRoles };
				usersService.updateUserRoles?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await controller.updateUserRoles(id, updateUserRolesDto);

				// 	Assert
				expect(usersService.updateUserRoles).toHaveBeenCalledWith(
					id,
					updateUserRolesDto,
				);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when UsersService.updateUserRoles throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersService.updateUserRoles?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(
					controller.updateUserRoles(id, updateUserRolesDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(
					controller.updateUserRoles(id, updateUserRolesDto),
				).rejects.toThrow('User not found');
			});
		});
	});

	describe('delete', () => {
		describe('when user with given id exists', () => {
			it('should call UsersService.remove and return removed user', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = { id };
				usersService.remove?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await controller.delete(id);

				// 	Assert
				expect(usersService.remove).toHaveBeenCalledWith(id);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when UsersService.remove throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersService.remove?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(controller.delete(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.delete(id)).rejects.toThrow('User not found');
			});
		});
	});
});
