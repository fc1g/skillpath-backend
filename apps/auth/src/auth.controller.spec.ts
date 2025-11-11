import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/common';
import { ConflictException } from '@nestjs/common';

type MockAuthService = Partial<Record<keyof AuthService, jest.Mock>>;

const createMockAuthService = (): MockAuthService => ({
	signup: jest.fn(),
});

describe('AuthController', () => {
	let authController: AuthController;
	let authService: MockAuthService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: createMockAuthService(),
				},
			],
		}).compile();

		authController = app.get<AuthController>(AuthController);
		authService = app.get<MockAuthService>(AuthService);
	});

	describe('root', () => {
		it('should be defined', () => {
			expect(authController).toBeDefined();
		});
	});

	describe('signup', () => {
		const createUserDto: CreateUserDto = {
			email: 'example@gmail.com',
			password: 'strongPass1234!',
		};

		describe('when payload is valid', () => {
			it('should delegate AuthService.signup and return created user', async () => {
				// 	Arrange
				const expectedUser = { id: '1', ...createUserDto };
				authService.signup?.mockResolvedValue(expectedUser);

				// 	Act
				const user = await authController.signup(createUserDto);

				// 	Assert
				expect(authService.signup).toHaveBeenCalledWith(createUserDto);
				expect(user).toEqual(expectedUser);
			});
		});

		describe('when service throws ConflictException', () => {
			it('should propagate ConflictException', async () => {
				// 	Arrange
				authService.signup?.mockRejectedValue(
					new ConflictException('User with this email already exists'),
				);

				// 	Assert
				await expect(authService.signup).rejects.toBeInstanceOf(
					ConflictException,
				);
				await expect(authController.signup(createUserDto)).rejects.toThrow(
					'User with this email already exists',
				);
			});
		});
	});
});
