import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import {
	ConflictException,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import {
	CreateRoleDto,
	DEFAULT_TAKE,
	POSTGRES_UNIQUE_VIOLATION,
	Role,
	RoleType,
	UpdateRoleDto,
	UpdateUserRolesDto,
} from '@app/common';

type MockRepository = Partial<Record<keyof RolesRepository, jest.Mock>>;

const createMockRepository = (): MockRepository => ({
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
});

describe('RolesService', () => {
	let service: RolesService;
	let rolesRepository: MockRepository;

	beforeAll(() => {
		jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
		jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesService,
				{ provide: RolesRepository, useValue: createMockRepository() },
			],
		}).compile();

		service = module.get<RolesService>(RolesService);
		rolesRepository = module.get<MockRepository>(RolesRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		describe('when payload is valid and role does not exist', () => {
			it('should create and return a new role', async () => {
				// Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.ADMIN,
				};
				const expectedRole = {
					id: '1',
					...createRoleDto,
				};
				rolesRepository.create?.mockResolvedValue(expectedRole);

				// Act
				const role = await service.create(createRoleDto);

				// Assert
				expect(rolesRepository.create).toHaveBeenCalledWith(createRoleDto);
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when role with the same name already exists', () => {
			it('should throw ConflictException with a proper message', async () => {
				// Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.USER,
				};
				rolesRepository.create?.mockRejectedValue({
					code: POSTGRES_UNIQUE_VIOLATION,
				});

				// Assert
				await expect(service.create(createRoleDto)).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(service.create(createRoleDto)).rejects.toThrow(
					'Role with this name already exists',
				);
			});
		});

		describe('when repository throws a non-unique constraint error', () => {
			it('should throw a generic InternalServerErrorException with a fallback message', async () => {
				// Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.ADMIN,
				};
				rolesRepository.create?.mockRejectedValue(
					new Error('Something went wrong'),
				);

				// Assert
				await expect(service.create(createRoleDto)).rejects.toBeInstanceOf(
					InternalServerErrorException,
				);
				await expect(service.create(createRoleDto)).rejects.toThrow(
					'Unable to create role, please try again later',
				);
			});
		});
	});

	describe('find', () => {
		describe('when roles exist', () => {
			it('should return a list of roles', async () => {
				// Arrange
				const expectedRoles = [{ id: '1' }];
				rolesRepository.find?.mockResolvedValue(expectedRoles);

				// Act
				const roles = await service.find();

				// Assert
				expect(rolesRepository.find).toHaveBeenCalledWith(
					{},
					{ take: DEFAULT_TAKE },
				);
				expect(roles).toEqual(expectedRoles);
			});
		});

		describe('when no roles exist', () => {
			it('should return an empty array', async () => {
				// Arrange
				const expectedRoles = [];
				rolesRepository.find?.mockResolvedValue(expectedRoles);

				// Act
				const roles = await service.find();

				// Assert
				expect(roles).toEqual(expectedRoles);
			});
		});
	});

	describe('findOne', () => {
		describe('when role with given ID exists', () => {
			it('should return the role', async () => {
				// Arrange
				const id = '1';
				const expectedRole = { id };
				rolesRepository.findOne?.mockResolvedValue(expectedRole);

				// Act
				const role = await service.findOne(id);

				// Assert
				expect(rolesRepository.findOne).toHaveBeenCalledWith({ id });
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when role with given ID does not exist', () => {
			it('should throw NotFoundException', async () => {
				// Arrange
				const id = '1';
				const message = 'Role not found';
				rolesRepository.findOne?.mockRejectedValue(
					new NotFoundException(message),
				);

				// Assert
				await expect(service.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.findOne(id)).rejects.toThrow(message);
			});
		});
	});

	describe('update', () => {
		describe('when role exists and updateRoleDto is not empty', () => {
			it('should update the role with provided data', async () => {
				// Arrange
				const id = '1';
				const updateRoleDto: UpdateRoleDto = { name: RoleType.ADMIN };
				const expectedRole = { id, ...updateRoleDto };
				rolesRepository.update?.mockResolvedValue(expectedRole);

				// Act
				const role = await service.update(id, updateRoleDto);

				// Assert
				expect(rolesRepository.update).toHaveBeenCalledWith(
					{ id },
					updateRoleDto,
				);
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when role does not exist', () => {
			it('should throw NotFoundException', async () => {
				// Arrange
				const id = '1';
				const updateRoleDto: UpdateRoleDto = {};
				rolesRepository.update?.mockRejectedValue(
					new NotFoundException('Role not found'),
				);

				// Assert
				await expect(service.update(id, updateRoleDto)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.update(id, updateRoleDto)).rejects.toThrow(
					'Role not found',
				);
			});
		});
	});

	describe('remove', () => {
		describe('when role with given ID exists', () => {
			it('should remove the role and return it', async () => {
				// Arrange
				const id = '1';
				const expected = { id };
				rolesRepository.remove?.mockResolvedValue(expected);

				// Act
				const removed = await service.remove(id);

				// Assert
				expect(rolesRepository.remove).toHaveBeenCalledWith({ id });
				expect(removed).toEqual(expected);
			});
		});

		describe('when role with given ID does not exist', () => {
			it('should throw NotFoundException', async () => {
				// Arrange
				const id = '1';
				rolesRepository.remove?.mockRejectedValue(
					new NotFoundException('Role not found'),
				);

				// Assert
				await expect(service.remove(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.remove(id)).rejects.toThrow('Role not found');
			});
		});
	});

	describe('applyRoleChanges', () => {
		describe('when both add and remove are provided', () => {
			it('applies additions and removals and returns the final deduplicated roles', async () => {
				// 	Arrange
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
				rolesRepository.findOne?.mockResolvedValue({
					id: '2',
					name: RoleType.ADMIN,
				});

				// 	Act
				const roles = await service.applyRoleChanges(
					updateUserRolesDto,
					currentRoles,
				);

				// 	Assert
				expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
				expect(rolesRepository.findOne).toHaveBeenCalledWith({
					name: RoleType.ADMIN,
				});
				expect(roles).toEqual(currentRoles);
			});
		});
	});

	describe('ensureUserRoles', () => {
		describe('when a valid extra role type is provided', () => {
			it('returns USER and the extra role', async () => {
				// 	Arrange
				const roleType = RoleType.ADMIN;
				const expectedRoles = [
					{ id: '1', name: RoleType.USER },
					{ id: '2', name: roleType },
				];
				rolesRepository.findOne?.mockResolvedValueOnce(expectedRoles[0]);
				rolesRepository.findOne?.mockResolvedValueOnce(expectedRoles[1]);

				// 	Act
				const roles = await service.ensureUserRoles(roleType);

				// 	Assert
				expect(rolesRepository.findOne).toHaveBeenCalledTimes(2);
				expect(roles).toEqual(expectedRoles);
			});
		});

		describe('when role type is omitted or invalid', () => {
			it('returns only the USER role', async () => {
				// 	Arrange
				const roleType = undefined;
				const expectedRoles = [{ id: '1', name: RoleType.USER }];
				rolesRepository.findOne?.mockResolvedValue(expectedRoles[0]);

				// 	Act
				const roles = await service.ensureUserRoles(roleType);

				// 	Assert
				expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
				expect(rolesRepository.findOne).toHaveBeenCalledWith({
					name: RoleType.USER,
				});
				expect(roles).toEqual(expectedRoles);
			});
		});
	});

	describe('preloadRoleByName', () => {
		describe('when role with given name exists', () => {
			it('should return the role', async () => {
				// 	Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.USER,
				};
				const expectedRole = {
					id: '1',
					...createRoleDto,
				};
				rolesRepository.findOne?.mockResolvedValue(expectedRole);

				// 	Act
				const role = await service.preloadRoleByName(createRoleDto);

				// 	Assert
				expect(rolesRepository.findOne).toHaveBeenCalledWith(createRoleDto);
				expect(role).toEqual(expectedRole);
			});
		});

		describe('when role with given name does not exist', () => {
			it('should create and return the role', async () => {
				// 	Arrange
				const createRoleDto: CreateRoleDto = {
					name: RoleType.ADMIN,
				};
				const expectedRole = {
					id: '1',
					...createRoleDto,
				};
				rolesRepository.create?.mockResolvedValue(expectedRole);

				// 	Act
				const role = await service.preloadRoleByName(createRoleDto);

				// 	Assert
				expect(rolesRepository.findOne).toHaveBeenCalledWith(createRoleDto);
				expect(role).toEqual(expectedRole);
			});
		});
	});
});
