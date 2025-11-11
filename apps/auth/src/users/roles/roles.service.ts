import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import {
	CreateRoleDto,
	DEFAULT_TAKE,
	POSTGRES_UNIQUE_VIOLATION,
	Role,
	RoleType,
	UpdateRoleDto,
} from '@app/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RolesService {
	private readonly logger: Logger = new Logger(RolesService.name);

	constructor(private readonly rolesRepository: RolesRepository) {}

	async create(createRoleDto: CreateRoleDto): Promise<Role> {
		const role = plainToClass(Role, {
			name: createRoleDto.name,
		});
		try {
			return await this.rolesRepository.create(role);
		} catch (err) {
			this.logger.error('Failed to create role', err);
			if ((err as { code?: string })?.code === POSTGRES_UNIQUE_VIOLATION) {
				throw new ConflictException('Role with this name already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create role, please try again later',
			);
		}
	}

	async find(): Promise<Role[]> {
		return this.rolesRepository.find(
			{},
			{
				take: DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Role> {
		return await this.rolesRepository.findOne({ id });
	}

	async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
		return this.rolesRepository.update({ id }, updateRoleDto);
	}

	async remove(id: string): Promise<Role> {
		return this.rolesRepository.remove({ id });
	}

	async ensureUserRoles(roleType?: RoleType): Promise<Role[]> {
		if (roleType && roleType !== RoleType.USER) {
			return await Promise.all(
				[RoleType.USER, roleType].map(name => this.preloadRoleByName({ name })),
			);
		}

		const userRole: Role = await this.preloadRoleByName({
			name: RoleType.USER,
		});

		return [userRole];
	}

	async preloadRoleByName(createRoleDto: CreateRoleDto): Promise<Role> {
		try {
			const existingRole = await this.rolesRepository.findOne({
				name: createRoleDto.name,
			});
			if (existingRole) {
				return existingRole;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createRoleDto);
	}
}
