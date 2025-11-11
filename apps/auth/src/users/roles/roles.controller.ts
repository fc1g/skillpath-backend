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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
	CreateRoleDto,
	Role,
	RoleDto,
	Roles,
	RoleType,
	Serialize,
	UpdateRoleDto,
} from '@app/common';

// TODO: @UseGuards(AccessJwtAuthGuard)
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
	@Serialize(RoleDto)
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
