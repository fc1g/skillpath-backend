import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
	CreateRoleDto,
	Role,
	RoleDto,
	Roles,
	RolesDto,
	RoleType,
	Serialize,
	UpdateRoleDto,
} from '@app/common';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';

@UseGuards(AccessJwtGuard)
@Roles(RoleType.ADMIN)
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@Serialize(RoleDto)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	@Serialize(RolesDto)
	async findAll(): Promise<Role[]> {
		return this.rolesService.find();
	}

	@Get(':id')
	@Serialize(RoleDto)
	async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Role> {
		return this.rolesService.findOne(id);
	}

	@Patch(':id')
	@Serialize(RoleDto)
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateRoleDto: UpdateRoleDto,
	): Promise<Role> {
		return this.rolesService.update(id, updateRoleDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<Role> {
		return this.rolesService.remove(id);
	}
}
