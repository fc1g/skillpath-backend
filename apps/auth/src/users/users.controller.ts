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
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	CurrentUser,
	MeDto,
	Roles,
	RoleType,
	Serialize,
	UpdateUserDto,
	UpdateUserRolesDto,
	User,
	UsersDto,
} from '@app/common';
import { AccessJwtGuard } from '../guards/access-jwt.guard';
import { UserMapper } from './mappers/user.mapper';

@UseGuards(AccessJwtGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Roles(RoleType.ADMIN)
	@Get()
	@Serialize(UsersDto)
	async findAll(): Promise<User[]> {
		return this.usersService.find();
	}

	@Get('me')
	@Serialize(MeDto)
	getUser(@CurrentUser() currentUser: User): MeDto {
		return UserMapper.toMeDto(currentUser);
	}

	@Roles(RoleType.ADMIN)
	@Get(':id')
	@Serialize(MeDto)
	async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	@Serialize(MeDto)
	async update(
		@CurrentUser() user: User,
		@Body() updateUserDto: UpdateUserDto,
		@Param('id', new ParseUUIDPipe()) id: string,
	): Promise<User> {
		return this.usersService.update(user, id, updateUserDto);
	}

	@Roles(RoleType.ADMIN)
	@Patch(':id/roles')
	@Serialize(MeDto)
	async updateUserRoles(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateUserRolesDto: UpdateUserRolesDto,
	): Promise<User> {
		return this.usersService.updateUserRoles(id, updateUserRolesDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@CurrentUser() user: User): Promise<User> {
		return this.usersService.remove(user.id);
	}
}
