import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleType, UpdateRoleDto } from '@app/common';
import { ConflictException, NotFoundException } from '@nestjs/common';

type MockService = Partial<Record<keyof RolesService, jest.Mock>>;

const createMockService = (): MockService => ({
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
});

describe('RolesController', () => {
	let controller: RolesController;
	let rolesService: MockService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RolesController],
			providers: [
				{
					provide: RolesService,
					useValue: createMockService(),
				},
			],
		}).compile();

		controller = module.get<RolesController>(RolesController);
		rolesService = module.get<MockService>(RolesService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create', () => {
		describe('when payload is valid', () => {
			it('should delegate to RolesService.create and return created role', async () => {
				// Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.ADMIN,
				};
				const expectedRole = { id: '1', ...createRoleDto };
				rolesService.create?.mockResolvedValue(expectedRole);

				// Act
				const role = await controller.create(createRoleDto);

				// Assert
				expect(rolesService.create).toHaveBeenCalledWith(createRoleDto);
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when service throws ConflictException', () => {
			it('should propagate ConflictException', async () => {
				// Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.USER,
				};
				const message = 'Role with this name already exists';
				rolesService.create?.mockRejectedValue(new ConflictException(message));

				// Assert
				await expect(controller.create(createRoleDto)).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(controller.create(createRoleDto)).rejects.toThrow(message);
			});
		});
	});

	describe('findAll', () => {
		describe('when RolesService.find returns roles', () => {
			it('should delegate to RolesService.find and return roles list', async () => {
				// Arrange
				const expected = [{ id: '1' }];
				rolesService.find?.mockResolvedValue(expected);

				// 	Act
				const roles = await controller.findAll();

				// 	Assert
				expect(rolesService.find).toHaveBeenCalled();
				expect(roles).toEqual(expected);
			});
		});
	});

	describe('findOne', () => {
		describe('when role with given id exists', () => {
			it('should call RolesService.findOne and return the role', async () => {
				// 	Arrange
				const id = '1';
				const expectedRole = { id };
				rolesService.findOne?.mockResolvedValue(expectedRole);

				// 	Act
				const role = await controller.findOne(id);

				// 	Assert
				expect(rolesService.findOne).toHaveBeenCalledWith(id);
				expect(role).toEqual(expectedRole);
			});
		});
		describe('when RolesService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				rolesService.findOne?.mockRejectedValue(
					new NotFoundException('Role not found'),
				);

				// 	Assert
				await expect(controller.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.findOne(id)).rejects.toThrow('Role not found');
			});
		});
	});

	describe('update', () => {
		describe('when role exists and payload is valid', () => {
			it('should call RolesService.update and return updated role', async () => {
				// 	Arrange
				const id = '1';
				const updateRoleDto: UpdateRoleDto = {
					name: RoleType.ADMIN,
				};
				const expectedRole = { id, ...updateRoleDto };
				rolesService.update?.mockResolvedValue(expectedRole);

				// 	Act
				const role = await controller.update(id, updateRoleDto);

				// 	Assert
				expect(rolesService.update).toHaveBeenCalledWith(id, updateRoleDto);
				expect(role).toEqual(expectedRole);
			});
		});
		describe('when RolesService.findOne throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				const updateRoleDto: UpdateRoleDto = {
					name: RoleType.ADMIN,
				};
				rolesService.update?.mockRejectedValue(
					new NotFoundException('Role not found'),
				);

				// 	Assert
				await expect(
					controller.update(id, updateRoleDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(controller.update(id, updateRoleDto)).rejects.toThrow(
					'Role not found',
				);
			});
		});
	});

	describe('delete', () => {
		describe('when role with given id exists', () => {
			it('should call RolesService.remove and return removed role', async () => {
				// 	Arrange
				const id = '1';
				const expectedRole = { id };
				rolesService.remove?.mockResolvedValue(expectedRole);

				// 	Act
				const role = await controller.delete(id);

				// 	Assert
				expect(rolesService.remove).toHaveBeenCalledWith(id);
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when RoleService.remove throws NotFoundException', () => {
			it('should propagate NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				rolesService.remove?.mockRejectedValue(
					new NotFoundException('Role not found'),
				);

				// 	Assert
				await expect(controller.delete(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(controller.delete(id)).rejects.toThrow('Role not found');
			});
		});
	});
});
