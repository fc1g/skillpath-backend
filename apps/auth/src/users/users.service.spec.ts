import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { RolesService } from './roles/roles.service';
import {
	BadRequestException,
	ConflictException,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
	CreateUserDto,
	DEFAULT_TAKE,
	POSTGRES_UNIQUE_VIOLATION,
	Role,
	RoleType,
	UpdateUserDto,
	UpdateUserRolesDto,
} from '@app/common';
import * as bcrypt from 'bcryptjs';

type MockUsersRepository = Record<keyof UsersRepository, jest.Mock>;
type MockRolesService = Partial<Record<keyof RolesService, jest.Mock>>;

const createMockUsersRepository = (): MockUsersRepository => ({
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
});

const createMockRolesService = (): MockRolesService => ({
	applyRoleChanges: jest.fn(),
	ensureUserRoles: jest.fn(),
	preloadRoleByName: jest.fn(),
});

const createUserDto: CreateUserDto = {
	email: 'example@gmail.com',
	password: 'strongPass1234!',
};

describe('UsersService', () => {
	let service: UsersService;
	let usersRepository: MockUsersRepository;
	let rolesService: MockRolesService;

	beforeAll(() => {
		jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
		jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UsersRepository,
					useValue: createMockUsersRepository(),
				},
				{
					provide: RolesService,
					useValue: createMockRolesService(),
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		usersRepository = module.get<MockUsersRepository>(UsersRepository);
		rolesService = module.get<MockRolesService>(RolesService);

		rolesService.ensureUserRoles?.mockResolvedValue([
			{ id: '1', name: RoleType.USER },
		]);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		describe('when payload is valid and user does not exist', () => {
			it('should create and return a new user', async () => {
				// 	Arrange
				const expectedUser = {
					id: '1',
					...createUserDto,
				};
				usersRepository.create?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await service.create(createUserDto);

				// 	Assert
				expect(usersRepository.create).toHaveBeenCalled();
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when payload is valid, user does not exist and extra roleType provided', () => {
			it('should create user with USER and the extra role', async () => {
				// 	Arrange
				const expectedRoles = [
					{ id: '1', name: RoleType.USER },
					{ id: '2', name: RoleType.ADMIN },
				];
				const expectedUser = {
					id: '1',
					...createUserDto,
					roles: expectedRoles,
				};
				rolesService.ensureUserRoles?.mockResolvedValue(expectedRoles);
				usersRepository.create?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await service.create(createUserDto, RoleType.ADMIN);

				// 	Assert
				expect(rolesService.ensureUserRoles).toHaveBeenCalledWith(
					RoleType.ADMIN,
				);
				expect(usersRepository.create).toHaveBeenCalled();
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when user with the same email already exists', () => {
			it('should throw ConflictException with a proper message', async () => {
				// 	Arrange
				usersRepository.create?.mockRejectedValue({
					code: POSTGRES_UNIQUE_VIOLATION,
				});

				// 	Assert
				await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(service.create(createUserDto)).rejects.toThrow(
					'User with this email already exists',
				);
			});
		});

		describe('when repository throws a non-unique constraint error', () => {
			it('should throw InternalServerErrorException with a fallback message', async () => {
				// 	Arrange
				usersRepository.create?.mockRejectedValue(
					new Error('Something went wrong'),
				);

				// 	Assert
				await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
					InternalServerErrorException,
				);
				await expect(service.create(createUserDto)).rejects.toThrow(
					'Unable to create user, please try again later',
				);
			});
		});
	});

	describe('verifyUser', () => {
		describe('when user exists and password is correct', () => {
			it('should find and return user', async () => {
				// 	Arrange
				const expectedUser = {
					id: '1',
					...createUserDto,
				};
				usersRepository.findOne?.mockResolvedValue(expectedUser);
				jest
					.spyOn(bcrypt, 'compare')
					.mockImplementation(async () => Promise.resolve(true));

				// 	Act
				const user = await service.verifyUser(
					createUserDto.email,
					createUserDto.password,
				);

				// 	Assert
				expect(bcrypt.compare).toHaveBeenCalledWith(
					createUserDto.password,
					expectedUser.password,
				);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when user has no password', () => {
			it('should throw BadRequestException', async () => {
				// Arrange
				const oauthUser = {
					id: '1',
					email: createUserDto.email,
					password: null,
				};
				usersRepository.findOne?.mockResolvedValue(oauthUser);

				// Assert
				await expect(
					service.verifyUser(createUserDto.email, createUserDto.password),
				).rejects.toBeInstanceOf(BadRequestException);
				await expect(
					service.verifyUser(createUserDto.email, createUserDto.password),
				).rejects.toThrow('Please sign in with your provider');
			});
		});

		describe('when password does not match', () => {
			it('should throw UnauthorizedException', async () => {
				// Arrange
				const user = {
					id: '1',
					email: createUserDto.email,
					password: 'hashed-password',
				};

				usersRepository.findOne?.mockResolvedValue(user);
				jest
					.spyOn(bcrypt, 'compare')
					.mockImplementation(async () => Promise.resolve(false));

				// Assert
				await expect(
					service.verifyUser(createUserDto.email, createUserDto.password),
				).rejects.toBeInstanceOf(UnauthorizedException);
				await expect(
					service.verifyUser(createUserDto.email, createUserDto.password),
				).rejects.toThrow('Credentials are not valid');
			});
		});
	});

	describe('find', () => {
		describe('when users exist', () => {
			it('should return a list of users', async () => {
				// 	Arrange
				const expectedUsers = [{ id: '1' }];
				usersRepository.find?.mockResolvedValue(expectedUsers);

				// 	Act
				const users = await service.find();

				// 	Assert
				expect(usersRepository.find).toHaveBeenCalledWith(
					{},
					{ take: DEFAULT_TAKE },
				);
				expect(users).toEqual(expectedUsers);
			});
		});

		describe('when no users exist', () => {
			it('should return an empty array', async () => {
				// 	Arrange
				const expectedUsers = [];
				usersRepository.find?.mockResolvedValue(expectedUsers);

				// 	Act
				const users = await service.find();

				// 	Assert
				expect(users).toEqual(expectedUsers);
			});
		});
	});

	describe('findOne', () => {
		describe('when user with given ID exists', () => {
			it('should return the user', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = { id };
				usersRepository.findOne?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await service.findOne(id);

				// 	Assert
				expect(usersRepository.findOne).toHaveBeenCalledWith(
					{ id },
					{ relations: { roles: true } },
				);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when user with given ID does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersRepository.findOne?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(service.findOne(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.findOne(id)).rejects.toThrow('User not found');
			});
		});
	});

	describe('update', () => {
		describe('when user exists and updateUserDto is not empty', () => {
			it('should update the user with provided data', async () => {
				// 	Arrange
				const id = '1';
				const updateUserDto: UpdateUserDto = {};
				const expectedUser = {
					id,
					...updateUserDto,
				};
				usersRepository.update?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await service.update(id, updateUserDto);

				// 	Assert
				expect(usersRepository.update).toHaveBeenCalledWith(
					{ id },
					updateUserDto,
				);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when user does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				const updateUserDto: UpdateUserDto = {};
				usersRepository.update?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(service.update(id, updateUserDto)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.update(id, updateUserDto)).rejects.toThrow(
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

		describe('when both add and remove are provided', () => {
			it('applies additions and removals and returns the final deduplicated role', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = {
					id,
					roles: currentRoles,
				};

				usersRepository.findOne?.mockResolvedValue({ id, roles: currentRoles });
				usersRepository.create?.mockResolvedValue(expectedUser);

				// 	Act
				const roles = await service.updateUserRoles(id, updateUserRolesDto);

				// 	Assert
				expect(usersRepository.findOne).toHaveBeenCalledWith(
					{ id },
					{ relations: { roles: true } },
				);
				expect(rolesService.applyRoleChanges).toHaveBeenCalledWith(
					updateUserRolesDto,
					currentRoles,
				);
				expect(roles).toEqual(expectedUser);
			});
		});

		describe('when user does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersRepository.findOne?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(
					service.updateUserRoles(id, updateUserRolesDto),
				).rejects.toBeInstanceOf(NotFoundException);
				await expect(
					service.updateUserRoles(id, updateUserRolesDto),
				).rejects.toThrow('User not found');
			});
		});
	});

	describe('remove', () => {
		describe('when user with given ID exists', () => {
			it('should remove the user and return it', async () => {
				// 	Arrange
				const id = '1';
				const expectedUser = { id };
				usersRepository.remove?.mockResolvedValue(expectedUser);

				// 	Act
				const removed = await service.remove(id);

				// 	Assert
				expect(usersRepository.remove).toHaveBeenCalledWith({ id });
				expect(removed).toEqual(expectedUser);
			});
		});

		describe('when user with given ID does not exist', () => {
			it('should throw NotFoundException', async () => {
				// 	Arrange
				const id = '1';
				usersRepository.remove?.mockRejectedValue(
					new NotFoundException('User not found'),
				);

				// 	Assert
				await expect(service.remove(id)).rejects.toBeInstanceOf(
					NotFoundException,
				);
				await expect(service.remove(id)).rejects.toThrow('User not found');
			});
		});
	});
});
