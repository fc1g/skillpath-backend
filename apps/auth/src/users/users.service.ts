import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
	BCRYPT_ROUNDS,
	CreateUserDto,
	DEFAULT_TAKE,
	POSTGRES_UNIQUE_VIOLATION,
	RoleType,
	UpdateUserDto,
	UpdateUserRolesDto,
	User,
} from '@app/common';
import { UsersRepository } from './users.repository';
import { RolesService } from './roles/roles.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
	private readonly logger: Logger = new Logger(UsersService.name);

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly rolesService: RolesService,
	) {}

	async create(
		createUserDto: CreateUserDto,
		roleType?: RoleType,
	): Promise<User> {
		const roles = await this.rolesService.ensureUserRoles(roleType);
		let hashedPassword: string | null = null;
		if (createUserDto.password) {
			hashedPassword = await bcrypt.hash(createUserDto.password, BCRYPT_ROUNDS);
		}

		const user = plainToClass(User, {
			email: createUserDto.email,
			password: hashedPassword,
			roles,
			oauthAccounts: [],
		});

		try {
			return await this.usersRepository.create(user);
		} catch (err) {
			this.logger.error('Failed to create user', err);
			if ((err as { code: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				throw new ConflictException('User with this email already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create user, please try again later',
			);
		}
	}

	async save(user: User): Promise<User> {
		return this.usersRepository.create(user);
	}

	async verifyUser(email: string, password: string): Promise<User> {
		const user = await this.findOneByEmail(email);

		if (user.password === null) {
			throw new UnauthorizedException(
				`Please login with OAuth provider (${user.oauthAccounts[0].provider})`,
			);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new UnauthorizedException('Credentials are not valid');
		}
		return user;
	}

	async find(): Promise<User[]> {
		return this.usersRepository.find(
			{},
			{
				take: DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<User> {
		return this.usersRepository.findOne(
			{ id },
			{
				relations: {
					roles: true,
					oauthAccounts: true,
				},
			},
		);
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.usersRepository.findOne(
			{ email },
			{
				relations: {
					roles: true,
					oauthAccounts: true,
				},
			},
		);
	}

	async update(
		user: User,
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		if (user.id !== id)
			throw new UnauthorizedException(
				'You are not authorized to update this user',
			);

		delete updateUserDto?.email;
		delete updateUserDto?.password;

		return this.usersRepository.update({ id }, updateUserDto);
	}

	async setPassword(user: User, newPassword: string) {
		if (user.password) {
			throw new BadRequestException('Password already set');
		}

		return this.updatePassword(
			user.id,
			await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
		);
	}

	async changePassword(
		user: User,
		currentPassword: string,
		newPassword: string,
	) {
		await this.verifyUser(user.email, currentPassword);

		return this.updatePassword(
			user.id,
			await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
		);
	}

	async resetPassword(usrId: string, newPassword: string) {
		await this.updatePassword(
			usrId,
			await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
		);
	}

	async updateUserRoles(
		id: string,
		updateUserRolesDto: UpdateUserRolesDto,
	): Promise<User> {
		const user = await this.findOne(id);

		user.roles = await this.rolesService.applyRoleChanges(
			updateUserRolesDto,
			user.roles,
		);

		return this.usersRepository.create(user);
	}

	async remove(id: string): Promise<User> {
		return this.usersRepository.remove({ id });
	}

	async preloadUserByEmail(createUserDto: CreateUserDto): Promise<User> {
		try {
			const existingUser = await this.findOneByEmail(createUserDto.email);
			if (existingUser) {
				return existingUser;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}
		return this.create(createUserDto);
	}

	private async updatePassword(userId: string, hashedPassword: string) {
		return this.usersRepository.update(
			{ id: userId },
			{ password: hashedPassword },
		);
	}
}
