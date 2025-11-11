import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from '@app/common';
import {
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';

type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;

const createMockUsersService = (): MockUsersService => ({
	create: jest.fn(),
});

describe('AuthService', () => {
	let service: AuthService;
	let usersService: MockUsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: createMockUsersService(),
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<MockUsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('signup', () => {
		const createUserDto: CreateUserDto = {
			email: 'example@gmail.com',
			password: 'strongPass1234!',
		};

		describe('when payload is valid and user does not exist', () => {
			it('should create and return a new user', async () => {
				// 	Arrange

				const expectedUser = {
					id: '1',
					...createUserDto,
				};
				usersService.create?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await service.signup(createUserDto);

				// 	Assert
				expect(usersService.create).toHaveBeenCalledWith(createUserDto);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when user with the same email already exists', () => {
			it('should throw ConflictException with a proper message', async () => {
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

		describe('when users service throws a non-unique constrains error', () => {
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
});
